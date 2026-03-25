import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdersAndProfiles();
  }, []);

  const fetchOrdersAndProfiles = async () => {
    try {
      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;

      // Map unique user IDs to fetch their profiles
      const userIds = [...new Set((ordersData || []).map(o => o.user_id))];
      
      let profilesMap: any = {};
      
      if (userIds.length > 0) {
        const { data: profsData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
          
        if (profsData) {
          profsData.forEach(p => {
             profilesMap[p.id] = `${p.first_name || 'Anonymous'} ${p.last_name || ''}`;
          });
        }
      }

      setProfiles(profilesMap);
      setOrders(ordersData || []);
    } catch (error: any) {
      toast.error('Failed to load orders database');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Order status instantly updated to ${newStatus}`);
      fetchOrdersAndProfiles();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-gray-500">Loading order fulfillment data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Order Fulfillment Tracker</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Tracking Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                  {order.id.substring(0, 8).toUpperCase()}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {profiles[order.user_id] || 'Unknown User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`ml-auto p-1.5 focus:outline-none focus:ring-2 focus:ring-[#8d4745] appearance-none cursor-pointer border rounded-md text-xs font-semibold
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                      ${order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                      ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                    `}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No active orders placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
