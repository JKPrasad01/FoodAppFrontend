import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { uniAPi } from "../api/uniAPi";
import { useAuth } from "../context/AuthContext";

const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await uniAPi.get(`/orders/${user.userId}`);
        const data = response.data;

        const mappedOrders = data.map((order) => ({
          id: order.orderId,
          restaurantName: order.restaurantName,
          date: new Date(order.orderDate).toISOString().split("T")[0],
          deliveryAddress: order.orderAddress,
          status: order.orderStatus,
          items: order.itemHistories.map((item) => ({
            name: item.menuName,
            image: item.menuProfile,
            price: item.price,
            quantity: item.quantity,
          })),
          total: order.itemHistories.reduce(
            (sum, obj) => sum + obj.price * obj.quantity,
            0
          ),
          deliveryTime: calculateDeliveryTime(order.orderDate, order.deliveryDate),
        }));

        setOrders(mappedOrders);
      } catch (err) {
        setError("Unable to fetch order history");
      }
    };

    fetchOrders();
  }, [authLoading, user, navigate]);

  const calculateDeliveryTime = (orderDate, deliveryDate) => {
    const diff =
      new Date(deliveryDate).getTime() - new Date(orderDate).getTime();
    return `${Math.round(diff / (1000 * 60))} min`;
  };

  const toggleOrder = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  if (authLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiPackage /> Order History
        </h1>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <FiPackage className="text-6xl mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-medium">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-200"
            >
              {/* Top Summary */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {order.restaurantName}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-1 text-sm">
                    <FiCalendar /> {order.date}
                  </p>
                </div>

                <button
                  onClick={() => toggleOrder(order.id)}
                  className="text-indigo-600 flex items-center gap-1"
                >
                  {expandedOrder === order.id ? (
                    <>
                      Hide <FiChevronUp />
                    </>
                  ) : (
                    <>
                      View <FiChevronDown />
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Section */}
              {expandedOrder === order.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 gap-3">
                    <p className="flex items-center gap-2 text-gray-700">
                      <FiMapPin /> {order.deliveryAddress}
                    </p>

                    <p className="flex items-center gap-2 text-gray-700">
                      <FiTruck />
                      Delivery Time: {order.deliveryTime}
                    </p>

                    <p className="flex items-center gap-2 text-gray-700">
                      <FiCheckCircle />
                      Status:{" "}
                      <span className="font-semibold">{order.status}</span>
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Items
                    </h3>

                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded object-cover border"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 border-t pt-4 flex justify-between items-center">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-xl font-bold text-indigo-600">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
