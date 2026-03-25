import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Users, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import logo from "../../images/terra-skin-logo.png";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/home');
      } else {
        setChecking(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Inter']">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8d4745] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying Permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-xl flex flex-col z-20">
        <div className="p-4 border-b border-gray-100 flex items-center justify-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="TerraSkin Logo" className="h-12 md:h-16 w-auto" />
          </Link>
        </div>
        
        <nav className="p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar border-b md:border-b-0 border-gray-100">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base ${
              activeTab === 'products' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="h-4 w-4 md:h-5 md:w-5" />
            Products
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base ${
              activeTab === 'users' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base ${
              activeTab === 'orders' ? 'bg-[#8d4745] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            Orders
          </button>
        </nav>

        <div className="p-4 md:border-t border-gray-100 mt-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-[#8d4745] hover:bg-gray-100 rounded-lg transition-colors font-bold text-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Site
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8 min-h-[calc(100vh-4rem)]">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'orders' && <AdminOrders />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
