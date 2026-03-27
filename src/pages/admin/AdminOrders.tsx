import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { Download, Filter, Search, RefreshCcw, BarChart3 } from 'lucide-react';
import OrderStats from '../../components/admin/OrderStats';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchOrdersAndProfiles();
  }, []);

  const fetchOrdersAndProfiles = async () => {
    try {
      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
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
      
      fetchOrdersAndProfiles();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.warning("No order data to export.");
      return;
    }

    try {
      const headers = ["Order ID", "Customer Name", "Customer Email", "Total Amount", "Status", "Date", "Door No", "Street", "Landmark", "City", "Pincode", "Mobile", "Shiprocket Order ID", "Shiprocket Status"];
      const csvData = filteredOrders.map(order => [
        order.id,
        profiles[order.user_id] || 'Unknown User',
        order.shipping_address?.email || 'N/A',
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleString(),
        order.shipping_address?.doorNo || 'N/A',
        order.shipping_address?.street || 'N/A',
        order.shipping_address?.landmark || 'N/A',
        order.shipping_address?.city || 'N/A',
        order.shipping_address?.pincode || 'N/A',
        order.shipping_address?.mobile || 'N/A',
        order.shiprocket_order_id || 'N/A',
        order.shiprocket_status || 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `terraskin_orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Order data exported successfully.");
    } catch (error) {
      toast.error("Failed to export order data.");
      console.error("Export error:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const customerName = (profiles[order.user_id] || '').toLowerCase();
    const matchesSearch = searchTerm === '' || 
                         customerName.includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="text-gray-500">Loading order fulfillment data...</div>;

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 border-b pb-4 gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display']">Order Fulfillment Tracker</h1>
          <p className="text-xs text-gray-500 mt-1">Total orders in database: {orders.length}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={fetchOrdersAndProfiles}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 text-sm font-medium"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8d4745] w-full"
            />
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8d4745] appearance-none cursor-pointer w-full"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="abandoned">Abandoned</option>
              <option value="failed">Failed Payment</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <button 
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border text-sm font-medium ${
              showStats ? 'bg-[#8d4745] text-white border-[#8d4745]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={18} />
            {showStats ? 'Hide Insights' : 'Show Insights'}
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-[#8d4745] text-white px-4 py-2 rounded-lg hover:bg-[#7a3f3d] transition-colors shadow-sm text-sm font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {showStats && <OrderStats orders={orders} />}

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm -mx-4 sm:mx-0 mb-6">
        <table className="min-w-[900px] w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Shipping Details</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Shiprocket ID</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Tracking Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className={order.status === 'cancelled' || order.status === 'abandoned' || order.status === 'failed' ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                  {order.id.substring(0, 8).toUpperCase()}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {profiles[order.user_id] || 'Unknown User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                  ₹{order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      {order.shipping_address?.doorNo ? `${order.shipping_address.doorNo}, ` : ''}{order.shipping_address?.street}
                    </span>
                    {order.shipping_address?.landmark && (
                      <span className="text-[10px] text-gray-400">Landmark: {order.shipping_address.landmark}</span>
                    )}
                    <span className="text-[10px]">
                      {order.shipping_address?.city}, {order.shipping_address?.pincode}
                    </span>
                    <span className="text-[10px] font-mono mt-1 text-[#8d4745]">
                      {order.shipping_address?.mobile} | {order.shipping_address?.email || 'No Email'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                  {order.shiprocket_order_id || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex flex-col items-end gap-1">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`ml-auto p-1.5 focus:outline-none focus:ring-2 focus:ring-[#8d4745] appearance-none cursor-pointer border rounded-md text-xs font-semibold
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                        ${order.status === 'abandoned' ? 'bg-gray-200 text-gray-800 border-gray-300' : ''}
                        ${order.status === 'failed' ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
                        ${order.status === 'refunded' ? 'bg-pink-100 text-pink-800 border-pink-200' : ''}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="abandoned">Abandoned</option>
                      <option value="failed">Failed Payment</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    {order.shiprocket_status && (
                      <span className="text-[10px] text-gray-400">SR: {order.shiprocket_status}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No matching orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
