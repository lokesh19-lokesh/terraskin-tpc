import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import SEO from "../components/SEO";
import { User } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingAddress {
  name: string;
  email: string;
  mobile: string;
  doorNo: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  country: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [session, setSession] = React.useState<Session | null>(null);

  const shippingAddress: ShippingAddress = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("shippingAddress") || "{}");
    } catch (e) {
      console.error("Failed to parse shipping address", e);
      return {} as ShippingAddress;
    }
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (!s) {
        toast.warning("Please login to complete your order");
        navigate("/login");
      }
    });
  }, [navigate]);

  const subtotal = state.total;
  const tax = subtotal * 0.08;
  const total = parseFloat((subtotal + tax).toFixed(2));

  const logAbandonedOrder = async (status: string) => {
    try {
      if (!session?.user?.id) {
        console.warn("No session user id found for logging order attempt.");
        return;
      }

      await supabase.from('orders').insert({
        user_id: session.user.id,
        total_amount: total,
        shipping_address: shippingAddress,
        status: 'cancelled',
      });

      toast.info(`Order attempt recorded as ${status}.`);
    } catch (err: any) {
      console.error("Failed to log order attempt:", err);
    }
  };

  const handlePayment = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        const options = {
          key: "rzp_live_SVqGXdnQFxriZN",
          amount: Math.round(total * 100),
          currency: "INR",
          name: "TerraSkin",
          description: "Premium Skincare Products",
          prefill: {
            name: shippingAddress.name || "Guest",
            contact: shippingAddress.mobile || "9999999999",
          },
          handler: async (response: any) => {
            try {
              if (!session?.user?.id) throw new Error("No active user session");

              toast.info("Processing your order...");

              const nameParts = (shippingAddress.name || "Guest").trim().split(/\s+/);
              const firstName = nameParts[0];
              const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".";

              const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('shiprocket', {
                body: {
                  action: 'checkout',
                  userId: session.user.id,
                  totalAmount: total,
                  shippingAddress: {
                    ...shippingAddress,
                    billing_customer_name: firstName,
                    billing_last_name: lastName
                  },
                  paymentId: response.razorpay_payment_id,
                  items: state.items
                }
              });

              if (checkoutError) {
                toast.error("Order Processing Error: " + checkoutError.message);
                throw checkoutError;
              }

              if (checkoutData && checkoutData.success) {
                toast.success("Order placed successfully!");
                setTimeout(() => {
                  dispatch({ type: 'CLEAR_CART' });
                  navigate("/orders");
                }, 1500);
              } else {
                const errMsg = checkoutData?.error ? (typeof checkoutData.error === 'object' ? JSON.stringify(checkoutData.error) : checkoutData.error) : "Checkout failed";
                toast.error(`Shiprocket Error: ${errMsg}`);
              }

            } catch (err: any) {
              console.error("Order processing failed:", err);
              toast.error(`Order processing failed: ${err.message || 'Please contact support.'}`);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled.");
              logAbandonedOrder('abandoned');
            }
          },
          theme: { color: "#8d4745" },
        };

        if (total <= 0) {
          toast.error("Total amount must be greater than 0");
          return;
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
          alert("Oops! Something went wrong.\n" + response.error.description);
          logAbandonedOrder('failed');
        });
        paymentObject.open();
      } else {
        toast.error("Razorpay SDK failed to load. Please try again later.");
      }
    };

    script.onerror = () =>
      toast.error("Failed to load Razorpay. Check your internet connection.");

    document.body.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <SEO title="Secure Payment" description="Complete your purchase securely via Razorpay. TerraSkin ensures your transaction is safe and encrypted." />
      <h1 className="text-3xl font-bold text-[#8d4745] mb-8 font-['Playfair_Display']">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-[#8d4745]">
            <User size={20} />
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Shipping Details</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Recipient</p>
              <p className="font-semibold text-gray-900">{shippingAddress.name}</p>
              <p className="text-sm">{shippingAddress.mobile}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Address</p>
              <p className="text-sm leading-relaxed">
                {shippingAddress.doorNo && `${shippingAddress.doorNo}, `}
                {shippingAddress.street}
                {shippingAddress.landmark && <><br /><span className="text-gray-400 italic">Near {shippingAddress.landmark}</span></>}
                <br />
                {shippingAddress.city}, {shippingAddress.pincode}
                <br />
                {shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Order Summary</h3>
            <div className="space-y-4 text-gray-600 mb-8 pb-6 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-gray-900">Total Payable</span>
              <span className="text-3xl font-bold text-[#8d4745]">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-[#8d4745] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#7a3f3d] transition-all duration-300 shadow-lg shadow-[#8d4745]/20 hover:shadow-[#8d4745]/40"
          >
            Pay Securely Now
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Payment;
