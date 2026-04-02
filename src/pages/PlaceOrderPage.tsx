import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, User, Plus, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";

const PlaceOrderPage: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    doorNo: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    country: "India",
  });
  const [recentAddresses, setRecentAddresses] = useState<any[]>([]);
  const [hiddenAddresses, setHiddenAddresses] = useState<string[]>(() => {
    const saved = localStorage.getItem("hiddenAddresses");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    // Load from localStorage immediately
    const saved = localStorage.getItem("shippingAddress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse local address", e);
      }
    }

    // Fetch from orders history if logged in
    fetchRecentAddresses();
  }, []);

  const fetchRecentAddresses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: orders, error } = await supabase
        .from('orders')
        .select('shipping_address')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (orders) {
        const unique = orders.reduce((acc: any[], current: any) => {
          const addr = current.shipping_address;
          if (!addr) return acc;
          const exists = acc.find(a => a.street === addr.street && a.name === addr.name);
          const isHidden = hiddenAddresses.includes(JSON.stringify(addr));
          if (!exists && !isHidden) acc.push(addr);
          return acc;
        }, []);
        setRecentAddresses(unique);
      }
    } catch (err) {
      console.error("Error fetching recent addresses:", err);
    }
  };

  const selectAddress = (addr: any) => {
    setFormData(addr);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    // Basic validation
    const { name, email, mobile, doorNo, street, city, pincode } = formData;
    if (!name || !email || !mobile || !doorNo || !street || !city || !pincode) {
      alert("Please fill in all required fields.");
      return;
    }

    // Full name validation (at least two words)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      alert("Please enter your full name (First Name and Last Name).");
      return;
    }

    // Note before ordering
    if (!window.confirm("Note: You will not get your amount refund after shipping the product. \n\nDo you want to proceed?")) {
      return;
    }

    // ✅ Save address details
    localStorage.setItem("shippingAddress", JSON.stringify(formData));

    // ✅ Navigate to Payment Page
    navigate("/payment");
  };

  const handleDeleteAddress = (address: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't select the address
    const addrStr = JSON.stringify(address);
    const updatedHidden = [...hiddenAddresses, addrStr];
    setHiddenAddresses(updatedHidden);
    localStorage.setItem("hiddenAddresses", JSON.stringify(updatedHidden));
    setRecentAddresses(prev => prev.filter(a => JSON.stringify(a) !== addrStr));
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <SEO title="Checkout | Shipping Details" description="Provide your shipping address and contact details to complete your TerraSkin order." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Address Form */}
        <div className="lg:col-span-2 space-y-6">
          {recentAddresses.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#8d4745]">
                <Clock size={20} />
                <h2 className="text-xl font-bold text-gray-900">Recent Addresses</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAddresses.map((addr, idx) => (
                  <div key={idx} className="relative group">
                    <button
                      onClick={() => selectAddress(addr)}
                      className={`w-full text-left p-4 border rounded-xl transition-all flex items-start gap-3 hover:shadow-md ${
                        JSON.stringify(formData) === JSON.stringify(addr)
                          ? "border-[#8d4745] bg-[#8d4745]/5"
                          : "border-gray-100 bg-white hover:border-[#8d4745]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        JSON.stringify(formData) === JSON.stringify(addr)
                          ? "bg-[#8d4745] text-white"
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        <MapPin size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{addr.name}</p>
                        <p className="text-sm text-gray-500 truncate">{addr.doorNo ? `${addr.doorNo}, ` : ''}{addr.street}</p>
                        <p className="text-xs text-gray-400">{addr.city}, {addr.pincode}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteAddress(addr, e)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from recent"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setFormData({ name: "", email: "", mobile: "", doorNo: "", street: "", landmark: "", city: "", pincode: "", country: "India" })}
                  className="text-left p-4 border border-dashed rounded-xl hover:border-[#8d4745] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-[#8d4745]"
                >
                  <Plus size={20} />
                  <span className="font-medium">New Address</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#8d4745]">
              <User size={20} />
              <h1 className="text-xl font-bold text-gray-900">Shipping Details</h1>
            </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
                required
              />
              <input
                type="text"
                name="doorNo"
                placeholder="Door No. / House No."
                value={formData.doorNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
                required
              />
            </div>

            <input
              type="text"
              name="street"
              placeholder="Street / Area Name"
              value={formData.street}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
              required
            />

            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={formData.landmark}
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
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8d4745] outline-none"
                required
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


