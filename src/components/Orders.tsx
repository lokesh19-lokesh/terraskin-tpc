import React from "react";

const Orders: React.FC = () => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-600">No orders yet</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-[#8d4745] mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order: any, index: number) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Order ID: {order.id}
            </h3>
            <p className="text-gray-600 mb-2">Date: {order.date}</p>
            <p className="text-gray-600 mb-2">Total: ₹{order.total.toFixed(2)}</p>
            <p className="text-gray-600 mb-2">
              Shipping: {order.address.name}, {order.address.city}
            </p>
            <div>
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {order.items.map((item: any, i: number) => (
                  <li key={i}>
                    {item.name} × {item.quantity} — ₹
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

