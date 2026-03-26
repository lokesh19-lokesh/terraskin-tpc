import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch('http://localhost:5000/api/shiprocket/cancel-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, shiprocketOrderId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error("An error occurred while cancelling the order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8d4745] border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-400 mb-4 font-['Playfair_Display']">No orders yet</h2>
        <p className="text-gray-500">Your order history will appear here once you make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-['Inter']">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#8d4745] mb-8 font-['Playfair_Display']">My Orders</h2>
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Order ID: <span className="text-gray-800 font-mono">{order.id.substring(0, 8).toUpperCase()}</span>
                  </h3>
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
                          <img src={item.products.image_url} alt="" className="w-10 h-10 rounded object-cover" />
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
                    {order.shipping_address?.name}, {order.shipping_address?.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total Amount:</p>
                  <p className="text-xl font-bold text-[#8d4745]">₹{order.total_amount.toFixed(2)}</p>
                  
                  {(order.status === 'processing' || order.status === 'pending') && (
                    <button
                      onClick={() => handleCancelOrder(order.id, order.shiprocket_order_id)}
                      className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              
              {order.shiprocket_order_id && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 uppercase">Shiprocket Tracking</span>
                  <span className="text-xs font-mono text-gray-700 font-bold">ID: {order.shiprocket_order_id}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

