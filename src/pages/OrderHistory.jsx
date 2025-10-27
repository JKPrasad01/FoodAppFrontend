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


const OrderHistory = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch orders from API
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await uniAPi.get(`/orders/${user.userId}`);
        // if (!response.ok) {
        //   throw new Error("Failed to fetch order history");
        // }
        const data = await response.data;

        // Map API data to component's expected structure
        const mappedOrders = data.map((order) => ({
          id: order.orderId,
          restaurantName: order.restaurantName,
          date: new Date(order.orderDate).toISOString().split("T")[0], // Format to YYYY-MM-DD
          deliveryAddress: order.orderAddress,
          status: order.orderStatus,
          items: order.itemHistories.map((item) => ({
            name: item.menuName,
            image: item.menuProfile, // Base64 image
            price: item.price,
            quantity: item.quantity,
          })),
          total: order.itemHistories.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          paymentMethod: "N/A", // Placeholder
          deliveryTime: calculateDeliveryTime(
            order.orderDate,
            order.deliveryDate
          ),
        }));

        setOrders(mappedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Calculate delivery time in minutes
  const calculateDeliveryTime = (orderDate, deliveryDate) => {
    const orderTime = new Date(orderDate).getTime();
    const deliveryTime = new Date(deliveryDate).getTime();
    const diffMinutes = Math.round((deliveryTime - orderTime) / (1000 * 60));
    return `${diffMinutes} min`;
  };

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "On the way":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Your Order History
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review your past orders, track current deliveries, and reorder your
            favorite meals
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start exploring our menu!
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="p-5 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiPackage className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center">
                        Order #{order.id} - {order.restaurantName}
                        <span
                          className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FiCalendar className="mr-2" />
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold text-lg mr-4">
                      ${order.total.toFixed(2)}
                    </span>
                    {expandedOrder === order.id ? (
                      <FiChevronUp className="text-gray-500 text-xl" />
                    ) : (
                      <FiChevronDown className="text-gray-500 text-xl" />
                    )}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 px-5 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <FiMapPin className="text-indigo-600 mr-2" />
                          Delivery Address
                        </h4>
                        <p className="text-gray-700">{order.deliveryAddress}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <FiCreditCard className="text-indigo-600 mr-2" />
                          Payment Method
                        </h4>
                        <p className="text-gray-700">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FiTruck className="text-indigo-600 mr-2" />
                      Items Ordered
                    </h4>

                    <div className="space-y-4 mb-6">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-gray-200 border">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiPackage />
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {item.name}
                              </h5>
                              <p className="text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-600 mb-3 md:mb-0">
                        <FiClock className="mr-2" />
                        <span>Delivery time: {order.deliveryTime}</span>
                      </div>

                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                          Rate Order
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-10 flex justify-center">
              <button className="flex items-center px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Load More Orders
                <FiChevronDown className="ml-2" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="bg-green-100 p-3 rounded-full">
                <FiCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Satisfied with your orders?
              </h3>
              <p className="text-gray-600 mb-4">
                Share your experience and help others discover great food
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
