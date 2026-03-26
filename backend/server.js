require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Shiprocket Auth Token Helper
let shiprocketToken = null;

const getShiprocketToken = async () => {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });
    shiprocketToken = response.data.token;
    return shiprocketToken;
  } catch (error) {
    console.error('Shiprocket Auth Error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Route to create order in Shiprocket
app.post('/api/shiprocket/create-order', async (req, res) => {
  const { orderId, shippingAddress, items, totalAmount } = req.body;

  try {
    if (!shiprocketToken) {
      await getShiprocketToken();
    }

    const orderData = {
      order_id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary", // Should be configured in Shiprocket
      billing_customer_name: shippingAddress.name,
      billing_last_name: "",
      billing_address: shippingAddress.street,
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state || shippingAddress.city,
      billing_country: shippingAddress.country,
      billing_email: shippingAddress.email || "guest@example.com",
      billing_phone: shippingAddress.mobile,
      shipping_is_billing: true,
      order_items: items.map(item => ({
        name: item.name,
        sku: item.id,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 0
      })),
      payment_method: "Prepaid",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${shiprocketToken}`
        }
      }
    );

    const shiprocketResult = response.data;

    // Update Supabase Order with Shiprocket info
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        shiprocket_order_id: shiprocketResult.order_id,
        shiprocket_shipment_id: shiprocketResult.shipment_id,
        shiprocket_status: 'NEW',
        status: 'processing'
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      shiprocket_order_id: shiprocketResult.order_id,
      shiprocket_shipment_id: shiprocketResult.shipment_id
    });

  } catch (error) {
    console.error('Shiprocket Order Creation Error:', error.response?.data || error.message);
    
    // If token expired, retry once
    if (error.response?.status === 401) {
      await getShiprocketToken();
      // Logic to retry could go here
    }

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

