import React, { useMemo } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface OrderStatsProps {
  orders: any[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const stats = useMemo(() => {
    const revenueByDate: Record<string, number> = {};
    const productSales: Record<string, number> = {};
    const locationSales: Record<string, number> = {};
    const statusCount: Record<string, number> = {};
    let totalRevenue = 0;
    let totalRefunds = 0;

    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      const amount = order.total_amount || 0;
      
      // Revenue & Refunds
      if (order.status !== 'cancelled' && order.status !== 'abandoned' && order.status !== 'failed') {
        revenueByDate[date] = (revenueByDate[date] || 0) + amount;
        if (order.status === 'refunded') {
          totalRefunds += amount;
        } else {
          totalRevenue += amount;
        }
      }

      // Status Distribution
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;

      // Location (from shipping_address)
      const city = order.shipping_address?.city || 'Unknown';
      locationSales[city] = (locationSales[city] || 0) + amount;

      // Product Sales
      if (order.order_items) {
        order.order_items.forEach((item: any) => {
          const name = item.products?.name || 'Unknown Product';
          productSales[name] = (productSales[name] || 0) + item.quantity;
        });
      }
    });

    const revenueData = Object.entries(revenueByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
    const productData = Object.entries(productSales).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const locationData = Object.entries(locationSales).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

    return { revenueData, productData, locationData, statusData, totalRevenue, totalRefunds };
  }, [orders]);

  const COLORS = ['#8d4745', '#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f1faee'];

  return (
    <div className="space-y-8 mb-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-[#8d4745]">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Refunds</p>
          <p className="text-3xl font-bold text-pink-600">₹{stats.totalRefunds.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Active Orders</p>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="amount" stroke="#8d4745" strokeWidth={3} dot={{ r: 4, fill: '#8d4745' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Top Selling Products (Units)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.productData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={10} width={100} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8d4745" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Location */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Sales by Location (City)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.locationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.locationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#a8dadc" radius={[4, 4, 0, 0]} barSize={40}>
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'cancelled' || entry.name === 'abandoned' ? '#e63946' : '#8d4745'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
