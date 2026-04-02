import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle Preflight (CORS)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    console.log(`🚀 [${new Date().toISOString()}] Incoming ${req.method} request to /shiprocket`)

    // 2. Validate Environment Variables (Secrets)
    const secrets = {
      SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      SHIPROCKET_EMAIL: Deno.env.get('SHIPROCKET_EMAIL'),
      SHIPROCKET_PASSWORD: Deno.env.get('SHIPROCKET_PASSWORD'),
      RAZORPAY_KEY: Deno.env.get('RAZORPAY_KEY'),
      RAZORPAY_SECRET: Deno.env.get('RAZORPAY_SECRET'),
    }

    const missingSecrets = Object.entries(secrets)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingSecrets.length > 0) {
      console.error("❌ Missing Secrets:", missingSecrets.join(", "))
      return new Response(
        JSON.stringify({ success: false, error: `Missing configuration: ${missingSecrets.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Safe JSON Parsing
    let payload;
    try {
      const text = await req.text()
      if (!text) throw new Error("Empty request body")
      payload = JSON.parse(text)
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message)
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, orderId, shiprocketOrderId, shipmentId, shippingAddress, items, totalAmount, paymentId, userId } = payload
    console.log(`📝 Action: ${action || 'none'} | User ID: ${userId || 'none'}`)

    const supabaseAdmin = createClient(secrets.SUPABASE_URL!, secrets.SUPABASE_SERVICE_ROLE_KEY!)
    const authHeader = btoa(`${secrets.RAZORPAY_KEY}:${secrets.RAZORPAY_SECRET}`)

    const getShiprocketToken = async () => {
      console.log("🔐 Fetching Shiprocket Token...")
      const authRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: secrets.SHIPROCKET_EMAIL, password: secrets.SHIPROCKET_PASSWORD }),
      })
      
      if (!authRes.ok) {
        const errData = await authRes.json()
        throw new Error(`Shiprocket Auth Failed: ${JSON.stringify(errData)}`)
      }

      const { token } = await authRes.json()
      return token
    }

    // --- 🛒 ACTION: CHECKOUT ---
    if (action === 'checkout') {
      if (!items || !userId || !paymentId) {
        throw new Error("Missing required checkout fields (items, userId, or paymentId)")
      }

      // 1. 🛡️ STOCK PRE-CHECK
      for (const item of items) {
        const { data: product, error: pErr } = await supabaseAdmin
          .from('products')
          .select('name, stock_quantity')
          .eq('id', item.id)
          .single()

        if (pErr || !product) throw new Error(`Product not found: ${item.name || item.id}`)
        
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock_quantity} remaining.`)
        }
      }

      // 2. 💰 Capture Payment
      console.log(`💰 Capturing Razorpay Payment: ${paymentId}`)
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalAmount * 100), currency: "INR" })
      })
      
      if (!rzpRes.ok) {
        const rzpErr = await rzpRes.json()
        console.error("❌ Razorpay Capture Error:", rzpErr)
        // We don't throw here yet if we want to allow re-trying, but usually, failure here means stop.
        throw new Error(`Payment capture failed: ${rzpErr.error?.description || 'Unknown error'}`)
      }

      // 3. 📄 Create Order in Supabase
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          status: 'processing',
          shipping_address: shippingAddress,
          payment_id: paymentId,
          payment_method: 'razorpay',
          payment_status: 'paid'
        })
        .select().single()

      if (orderError) throw orderError

      // 4. 📉 UPDATE STOCK & SAVE ITEMS
      for (const item of items) {
        await supabaseAdmin.from('order_items').insert({
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price
        })

        const { data: latestProd } = await supabaseAdmin.from('products').select('stock_quantity').eq('id', item.id).single()
        const newStock = Math.max(0, (latestProd?.stock_quantity || 0) - item.quantity)
        await supabaseAdmin.from('products').update({ stock_quantity: newStock }).eq('id', item.id)
      }

      // 5. 📦 Sync with Shiprocket
      try {
        const token = await getShiprocketToken()
        const nameParts = (shippingAddress.name || "Guest").trim().split(/\s+/);
        
        const shiprocketOrderData = {
          order_id: orderData.id,
          order_date: new Date().toISOString().split('T')[0],
          pickup_location: "home",
          billing_customer_name: nameParts[0],
          billing_last_name: nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".",
          billing_address: `${shippingAddress.doorNo}, ${shippingAddress.street}`,
          billing_address_2: shippingAddress.landmark || "",
          billing_city: shippingAddress.city,
          billing_pincode: shippingAddress.pincode,
          billing_state: shippingAddress.state || shippingAddress.city,
          billing_country: "India",
          billing_email: shippingAddress.email,
          billing_phone: shippingAddress.mobile,
          shipping_is_billing: true,
          order_items: items.map((i: any) => ({ name: i.name, sku: i.id.toString(), units: i.quantity, selling_price: i.price })),
          payment_method: "Prepaid",
          sub_total: totalAmount,
          length: 10, breadth: 10, height: 10, weight: 0.5
        }

        const srRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(shiprocketOrderData),
        })

        const srData = await srRes.json()
        if (srData?.order_id) {
          await supabaseAdmin.from('orders').update({
            shiprocket_order_id: srData.order_id,
            shiprocket_shipment_id: srData.shipment_id,
            shiprocket_status: 'NEW'
          }).eq('id', orderData.id)
        }
      } catch (e) {
        console.error("❌ Shiprocket Sync Error (Non-Fatal):", e.message)
        // We return success true because the order is created in Supabase.
      }

      return new Response(JSON.stringify({ success: true, orderId: orderData.id }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // --- 🔙 ACTION: CANCEL ---
    else if (action === 'cancel') {
      const { data: order } = await supabaseAdmin.from('orders').select('payment_id, shiprocket_status').eq('id', orderId).single()
      if (['SHIPPED', 'DELIVERED'].includes(order?.shiprocket_status)) return new Response(JSON.stringify({ success: false, error: "Already shipped." }), { headers: corsHeaders })

      if (shiprocketOrderId) {
        try {
          const token = await getShiprocketToken()
          await fetch('https://apiv2.shiprocket.in/v1/external/orders/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ids: [shiprocketOrderId] }),
          })
        } catch (e) { console.error("SR Cancel Error:", e) }
      }

      if (order?.payment_id) {
        try {
          const checkRes = await fetch(`https://api.razorpay.com/v1/payments/${order.payment_id}`, { headers: { 'Authorization': `Basic ${authHeader}` } })
          const payData = await checkRes.json()
          if (payData.status === 'captured') {
            await fetch(`https://api.razorpay.com/v1/payments/${order.payment_id}/refund`, {
              method: 'POST',
              headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ notes: { reason: "User cancelled" } })
            })
          }
        } catch (e) { console.error("RZP Refund Error:", e) }
      }

      await supabaseAdmin.from('orders').update({ status: 'cancelled', shiprocket_status: 'CANCELLED', payment_status: 'refunded' }).eq('id', orderId)
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // --- 📍 ACTION: TRACK ---
    else if (action === 'track') {
      const token = await getShiprocketToken()
      const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const trackingData = await res.json()
      return new Response(JSON.stringify({ success: true, tracking: trackingData }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    throw new Error(`Invalid action: ${action}`)

  } catch (error: any) {
    console.error("❌ [Global Handler] Fatal Error:", error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
