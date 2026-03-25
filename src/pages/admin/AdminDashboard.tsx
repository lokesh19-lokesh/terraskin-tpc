import React, { useState } from 'react';
import { Package, Users, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-['Instrument_Serif'] text-[#8d4745]">TerraControl</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'products' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="h-5 w-5" />
            Products
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'users' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'orders' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Site
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[calc(100vh-4rem)]">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'orders' && <AdminOrders />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
