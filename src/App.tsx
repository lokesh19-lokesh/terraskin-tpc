import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Login from './components/Login';
import Signup from './components/Signup';
import PlaceOrderPage from './pages/PlaceOrderPage';
import "react-toastify/dist/ReactToastify.css";
import Payment from './pages/Payment';
import Orders from "./components/Orders";
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/login-about' || location.pathname === '/login-contact';

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-about" element={
            <div className="relative">
              <Link to="/" className="absolute top-4 left-4 z-50 bg-[#8d4745] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#7a3f3d] transition-colors">
                ← Back
              </Link>
              <AboutPage />
            </div>
          } />
          <Route path="/login-contact" element={
            <div className="relative">
              <Link to="/" className="absolute top-4 left-4 z-50 bg-[#8d4745] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#7a3f3d] transition-colors">
                ← Back
              </Link>
              <ContactPage />
            </div>
          } />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/PlaceOrderPage' element={<PlaceOrderPage/>}/>
          <Route path='/payment' element={<Payment/>} />
          <Route path="/orders" element={<Orders />} />

          {/* Secure Admin Portal */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;