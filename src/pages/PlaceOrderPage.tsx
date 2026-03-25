import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Payment from "../pages/Payment"

const PlaceOrderPage: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    street: "",
    pincode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    // ✅ Save address details (optional: send to backend or localStorage)
    localStorage.setItem("shippingAddress", JSON.stringify(formData));

    // ✅ Navigate to Payment Page
    navigate("/Payment");
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Address Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
              />
            </div>

            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
              />
            </div>

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
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
              onClick={handleProceedToPayment}
              className="w-full bg-[#8d4745] text-white py-3 px-6 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300 font-semibold"
            >
              Place Order & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;


