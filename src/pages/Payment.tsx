// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface ShippingAddress {
//   name: string;
//   mobile: string;
//   city: string;
//   street: string;
//   pincode: string;
//   country: string;
// }

// const Payment: React.FC = () => {
//   const navigate = useNavigate();
//   const { state, clearCart } = useCart();
//   const shippingAddress: ShippingAddress = JSON.parse(
//     localStorage.getItem("shippingAddress") || "{}"
//   );

//   const subtotal = state.total;
//   const tax = subtotal * 0.08;
//   const total = subtotal + tax;

//   const handlePayment = () => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;

//     script.onload = () => {
//       if (window.Razorpay) {


//         const options = {
//           key: "rzp_test_RqeqE8DYASBElz",
//           amount: Math.round(total * 100), // in paise, integer
//           currency: "INR",
//           name: "Your Store",
//           description: "Order Payment",
//           prefill: {
//             name: shippingAddress.name || "Guest",
//             contact: shippingAddress.mobile || "9999999999",
//           },
//           handler: function (response: any) {
//             toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
//             clearCart();
//             navigate("/");
//           },
//           theme: { color: "#8d4745" },
//         };

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//       } else {
//         toast.error("Razorpay SDK failed to load. Please try again later.");
//       }
//     };

//     script.onerror = () =>
//       toast.error("Failed to load Razorpay. Check your internet connection.");

//     document.body.appendChild(script);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
//       <h2 className="text-3xl font-bold text-[#8d4745] mb-8">Checkout</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
//         {/* Shipping Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">
//             Shipping Information
//           </h3>
//           <div className="space-y-2 text-gray-600">
//             <p>
//               <span className="font-semibold">Name:</span> {shippingAddress.name}
//             </p>
//             <p>
//               <span className="font-semibold">Mobile:</span> {shippingAddress.mobile}
//             </p>
//             <p>
//               <span className="font-semibold">Address:</span>{" "}
//               {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.pincode},{" "}
//               {shippingAddress.country}
//             </p>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
//           <h3 className="text-xl font-semibold text-gray-700 mb-6">Order Summary</h3>
//           <div className="space-y-3 text-gray-600 mb-6">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (8%)</span>
//               <span>₹{tax.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="border-t pt-4 mb-6 flex justify-between items-center">
//             <span className="text-lg font-bold text-gray-900">Total</span>
//             <span className="text-lg font-bold text-[#8d4745]">₹{total.toFixed(2)}</span>
//           </div>

//           <button
//             onClick={handlePayment}
//             className="w-full bg-[#8d4745] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#7a3f3d] transition-colors duration-300"
//           >
//             Pay Now ₹{total.toFixed(2)}
//           </button>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Payment;


import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingAddress {
  name: string;
  mobile: string;
  city: string;
  street: string;
  pincode: string;
  country: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// interface Order {
//   id: string;
//   items: OrderItem[];
//   total: number;
//   address: ShippingAddress;
//   date: string;
// }

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [session, setSession] = React.useState<Session | null>(null);
  
  const shippingAddress: ShippingAddress = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("shippingAddress") || "{}");
    } catch (e) {
      console.error("Failed to parse shipping address", e);
      return {} as ShippingAddress; // Return an empty object cast to ShippingAddress
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

  // const handlePayment = () => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;

  //   script.onload = () => {
  //     if (window.Razorpay) {
  //       const options = {
  //         key: "rzp_test_RqeqE8DYASBElz", // Replace with your Razorpay key
  //         amount: Math.round(total * 100), // in paise
  //         currency: "INR",
  //         name: "Your Store",
  //         description: "Order Payment",
  //         prefill: {
  //           name: shippingAddress.name || "Guest",
  //           contact: shippingAddress.mobile || "9999999999",
  //         },
  //         handler: function (response: any) {
  //           // ✅ Create order object
  //           const order: Order = {
  //             id: response.razorpay_payment_id,
  //             items: state.items || [],
  //             total: total,
  //             address: shippingAddress,
  //             date: new Date().toLocaleString(),
  //           };

  //           // ✅ Save order to localStorage
  //           const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  //           existingOrders.push(order);
  //           localStorage.setItem("orders", JSON.stringify(existingOrders));

  //           // ✅ Show success toast
  //           toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

  //           // ✅ Clear cart
  //           clearCart();

  //           // ✅ Navigate to orders page
  //           navigate("/orders");
  //         },
  //         theme: { color: "#8d4745" },
  //       };

  //       const paymentObject = new window.Razorpay(options);
  //       paymentObject.open();
  //     } else {
  //       toast.error("Razorpay SDK failed to load. Please try again later.");
  //     }
  //   };

  //   script.onerror = () =>
  //     toast.error("Failed to load Razorpay. Check your internet connection.");

  //   document.body.appendChild(script);
  // };

  const handlePayment = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        const options = {
          key: "rzp_test_RqeqE8DYASBElz",
          amount: Math.round(total * 100),
          currency: "INR",
          name: "Your Store",
          description: "Order Payment",
          prefill: {
            name: shippingAddress.name || "Guest",
            contact: shippingAddress.mobile || "9999999999",
          },
          handler: async (response: any) => {
            console.log("Razorpay success response:", response);
            try {
              if (!session?.user?.id) throw new Error("No active user session");

              // 🟢 Single call to Supabase Edge Function to handle EVERYTHING
              // (Order creation, Order Items, and Shiprocket Sync)
              toast.info("Processing your order...");
              
              const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('shiprocket', {
                body: {
                  action: 'checkout',
                  userId: session.user.id,
                  totalAmount: total,
                  shippingAddress: shippingAddress,
                  paymentId: response.razorpay_payment_id,
                  items: state.items
                }
              });

              if (checkoutError) {
                toast.error("Supabase Connection Error: " + checkoutError.message);
                throw checkoutError;
              }

              if (checkoutData && checkoutData.success) {
                toast.success("Order placed successfully!");
                
                // ✅ Clear cart and move on
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
            ondismiss: function() {
              toast.info("Payment cancelled.");
            }
          },
          theme: { color: "#8d4745" },
        };

        if (total <= 0) {
          toast.error("Total amount must be greater than 0");
          return;
        }

        console.log("Opening Razorpay with options:", options);
        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
          console.error("Payment failed listener:", response.error);
          alert("Oops! Something went wrong.\n" + response.error.description);
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
      <h2 className="text-3xl font-bold text-[#8d4745] mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Shipping Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Shipping Information
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">Name:</span> {shippingAddress.name}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span> {shippingAddress.mobile}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.pincode},{" "}
              {shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Order Summary</h3>
          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-6 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-[#8d4745]">₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-[#8d4745] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#7a3f3d] transition-colors duration-300"
          >
            Pay Now ₹{total.toFixed(2)}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Payment;

