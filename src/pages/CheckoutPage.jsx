import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { uniAPi } from "../api/uniAPi";
import { useAuth } from "../context/AuthContext";
import { FiMapPin, FiPhone, FiPackage, FiShoppingBag } from "react-icons/fi";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cartItems, restaurantId, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (authLoading || !user) return null;

  const validateInputs = () => {
    if (!deliveryAddress.trim()) return "Delivery address is required.";
    if (!/^\d{10}$/.test(contactNumber))
      return "Contact number must be 10 digits.";
    if (!cartItems.length) return "Your cart is empty!";
    if (!restaurantId) return "No restaurant selected.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const paymentStatus =
        paymentMethod === "credit-card" ? "PENDING" : "COMPLETED";

      const orderData = {
        userId: user.userId,
        restaurantId,
        orderItemList: cartItems.map((item) => ({
          menuId: item.menuId,
          quantity: Number(item.quantity),
        })),
        deliveryAddress,
        contactNumber,
        paymentStatus,
      };

      const response = await uniAPi.post(`/orders/create`, orderData);

      if (response.status === 200) {
        clearCart();
        navigate("/success", {
          state: { orderNumber: response.data.orderNumber },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Order creation failed. Please try again."
      );
      navigate("/failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">

          {/* Order Summary */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <FiShoppingBag className="text-indigo-600 mr-2" />
              Order Summary
            </h2>

            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.menuId}
                    className="flex justify-between items-center pb-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.menuName} × {item.quantity}
                      </p>
                      <p className="text-gray-600 text-sm">₹{item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    ₹{cartTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Delivery Address
              </label>
              <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                <FiMapPin className="text-indigo-600 mr-3" />
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                <FiPhone className="text-indigo-600 mr-3" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["credit-card", "paypal", "apple-pay"].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`border rounded-lg py-3 text-center transition ${
                      paymentMethod === method
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {method.replace("-", " ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !cartItems.length}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
