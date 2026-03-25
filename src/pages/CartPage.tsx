import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import PlaceOrderPage from './PlaceOrderPage';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate(); // ✅ must be inside component

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handleCheckout = () => {
    navigate('/PlaceOrderPage'); // ✅ navigate to Place Order page
  };

  if (state.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatedSection className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start exploring our amazing products!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#8d4745] text-white px-8 py-3 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300 font-semibold"
            >
              Continue Shopping
            </Link>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-8">
            Shopping Cart ({state.itemCount} items)
          </h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 100} animation="slide-up">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-[#8d4745] transition-colors duration-200">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <p className="text-lg font-bold text-[#8d4745] mt-2">₹{item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="slide-left">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{(state.total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-[#8d4745]">
                      ₹{(state.total * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-[#8d4745] text-white py-3 px-6 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300 font-semibold mb-4"
                >
                  Proceed to Checkout
                </button>
                
                <Link
                  to="/shop"
                  className="block text-center text-[#8d4745] hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
