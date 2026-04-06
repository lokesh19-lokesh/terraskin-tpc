import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import SEO from "./SEO";
import { CheckCircle } from "lucide-react";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState<Record<string, any>>({});
  const [trackingLoading, setTrackingLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string, shiprocketOrderId: string | null) => {
    const message = "Are you sure you want to cancel this order? \n\nNote: You will not get your amount refund after shipping the product.";
    if (!window.confirm(message)) return;

    try {
      const { data, error } = await supabase.functions.invoke('shiprocket', {
        body: {
          action: 'cancel',
          orderId,
          shiprocketOrderId
        }
      });

      if (error) {
        toast.error("Supabase Connection Error: " + error.message);
        throw error;
      }
      
      if (data && data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        const errMsg = data?.error ? (typeof data.error === 'object' ? JSON.stringify(data.error) : data.error) : "Failed to cancel order";
        toast.error(`Cancellation failed: ${errMsg}`);
      }
    } catch (err: any) {
      console.error("Cancellation error:", err);
      toast.error(`An error occurred: ${err.message || 'Server connection failed'}`);
    }
  };

  const handleTrackOrder = async (orderId: string, shipmentId: string) => {
    try {
      setTrackingLoading(prev => ({ ...prev, [orderId]: true }));
      const { data, error } = await supabase.functions.invoke('shiprocket', {
        body: {
          action: 'track',
          shipmentId
        }
      });

      if (error) throw error;
      
      if (data && data.success) {
        setTrackingInfo(prev => ({ ...prev, [orderId]: data.tracking }));
      } else {
        toast.error("Could not fetch tracking info.");
      }
    } catch (err: any) {
      console.error("Tracking error:", err);
      toast.error("Failed to fetch live tracking.");
    } finally {
      setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8d4745] border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-400 mb-4 font-['Playfair_Display']">No orders yet</h2>
        <p className="text-gray-500">Your order history will appear here once you make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 p-6 bg-gray-50 font-['Inter']">
      <SEO title="My Orders" description="View your order history and track the live status of your TerraSkin skincare purchases." />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#8d4745] mb-8 font-['Playfair_Display']">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order: any) => {
            const liveStatus = (trackingInfo[order.id]?.tracking_data?.shipment_track?.[0]?.current_status || 
                                trackingInfo[order.id]?.tracking_data?.shipment_status_name || "").toUpperCase();
            const isDelivered = order.status === 'delivered' || liveStatus === 'DELIVERED';

            return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center flex-wrap gap-2">
                    <span>Order ID: <span className="text-gray-800 font-mono">{order.id.substring(0, 8).toUpperCase()}</span></span>
                  </h3>
                  {isDelivered && (
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-bold lowercase">delivered</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-50 py-4 mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Items</h4>
                <div className="space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {item.products?.image_url && (
                          <img src={item.products.image_url} alt={item.products.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Shipping to:</p>
                  <p className="text-sm font-medium text-gray-700">
                    {order.shipping_address?.doorNo ? `${order.shipping_address.doorNo}, ` : ''}{order.shipping_address?.street}
                  </p>
                  {order.shipping_address?.landmark && (
                    <p className="text-xs text-gray-400">Landmark: {order.shipping_address.landmark}</p>
                  )}
                  <p className="text-xs text-gray-500 italic mt-0.5">
                    {order.shipping_address?.city}, {order.shipping_address?.pincode} | Ph: {order.shipping_address?.mobile}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total Amount:</p>
                  <p className="text-xl font-bold text-[#8d4745]">₹{order.total_amount.toFixed(2)}</p>
                  
                  {(() => {
                    const trackingStatus = (trackingInfo[order.id]?.tracking_data?.shipment_track?.[0]?.current_status || 
                                          trackingInfo[order.id]?.tracking_data?.shipment_status_name || "").toUpperCase();
                    const isPickedUp = trackingStatus.includes("PICKED UP") || 
                                     trackingStatus.includes("SHIPPED") || 
                                     trackingStatus.includes("TRANSIT") || 
                                     trackingStatus.includes("DELIVERY") || 
                                     trackingStatus.includes("DELIVERED");

                    return (order.status === 'processing' || order.status === 'pending') && !isPickedUp && (
                      <button
                        onClick={() => handleCancelOrder(order.id, order.shiprocket_order_id)}
                        className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Cancel Order
                      </button>
                    );
                  })()}
                </div>
              </div>
              
              {order.shiprocket_order_id && (
                <div className="mt-4 pt-4 border-t border-gray-50 bg-gray-50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Shiprocket Tracking</span>
                      <span className="text-xs font-mono text-gray-700 font-bold">ID: {order.shiprocket_order_id}</span>
                    </div>
                    {order.shiprocket_shipment_id && !trackingInfo[order.id] && (
                      <button
                        onClick={() => handleTrackOrder(order.id, order.shiprocket_shipment_id)}
                        disabled={trackingLoading[order.id]}
                        className="text-xs font-bold text-[#8d4745] hover:text-[#7a3d3c] bg-white border border-[#e8d5d4] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        {trackingLoading[order.id] ? 'Fetching...' : 'Track Live Status'}
                      </button>
                    )}
                  </div>

                  {trackingInfo[order.id] && (
                    <div className="bg-white border border-gray-100 rounded-lg p-3 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          trackingInfo[order.id]?.tracking_data?.shipment_track?.[0]?.current_status ? 'bg-green-500' : 'bg-amber-500'
                        }`}></div>
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                          Live Status: {
                            trackingInfo[order.id]?.tracking_data?.shipment_track?.[0]?.current_status || 
                            trackingInfo[order.id]?.tracking_data?.shipment_status_name ||
                            'Awaiting Pickup'
                          }
                        </p>
                      </div>
                      
                      {trackingInfo[order.id]?.tracking_data?.shipment_track?.[0]?.scanned_location && (
                        <p className="text-xs text-gray-500 italic">
                          Last Location: {trackingInfo[order.id].tracking_data.shipment_track[0].scanned_location}
                        </p>
                      )}
                      
                      {!trackingInfo[order.id]?.tracking_data?.shipment_track?.[0] && (
                        <p className="text-[10px] text-gray-400">
                          Tracking updates typically appear within 24-48 hours after pickup.
                        </p>
                      )}
                      
                      {trackingInfo[order.id]?.tracking_data?.track_url && (
                        <a 
                          href={trackingInfo[order.id].tracking_data.track_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-[#8d4745] hover:underline block mt-2"
                        >
                          View Detailed Tracking Page →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default Orders;

