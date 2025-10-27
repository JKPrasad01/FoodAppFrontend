import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { uniAPi } from "../api/uniAPi";

const CheckoutPage = () => {
  const { cartItems, restaurantId, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  console.log("User ID:", user?.id);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        console.log("Redirecting to login from:", location.pathname);
        navigate("/login", { state: { from: location.pathname } });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, navigate, location]);

  const validateInputs = () => {
    if (!deliveryAddress.trim()) return "Delivery address is required";
    if (!contactNumber.match(/^\d{10}$/))
      return "Contact number must be 10 digits";
    if (!cartItems.length) return "Cart is empty";
    if (!restaurantId) return "No restaurant selected";
    if (!paymentMethod) return "Payment method is required";
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
      // Map paymentMethod to paymentStatus
      const paymentStatus =
        paymentMethod === "credit-card" ? "PENDING" : "COMPLETED";

      // Prepare OrderDTO payload
      const orderData = {
        userId: user.userId,
        restaurantId,
        orderItemList: cartItems.map((item) => ({
          menuId: item.menuId,
          quantity: Number(item.quantity), // Ensure Long type
        })),
        deliveryAddress,
        contactNumber,
        paymentStatus,
      };

      console.log("Sending orderData:", orderData);

      // Handle credit card payment intent (if applicable)
      let paymentIntent = null;
      if (paymentMethod === "credit-card") {
        const { data } = await uniAPi.post(`/payments/create-intent`, {
          amount: cartTotal * 100, // Convert to cents
          currency: "inr",
        });
        paymentIntent = data;
      }

      // Create order
      console.log("userData--->", user);
      const response = await uniAPi.post(`/orders/create`, orderData);

      if (response.status === 200) {
        console.log("successfully");
        clearCart();
        navigate("/success", {
          state: { orderNumber: response.data.orderNumber },
        });
      }
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.status === 400 && err.response.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e) => e.defaultMessage)
          .join("; ");
        setError(`Validation failed: ${validationErrors}`);
      } else {
        setError(
          err.response?.data?.error ||
            "Order creation failed. Please try again."
        );
      }
      console.error("Order creation error:", err.response?.data || err);
      navigate("/failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-indigo-700 text-white p-6">
            <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
            <p className="opacity-90">Final step to confirm your order</p>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <>
                {restaurantId && (
                  <p className="text-gray-600 mb-4">
                    Ordering from Restaurant ID: {restaurantId}
                  </p>
                )}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.menuId} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.menuName} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && <div className="text-red-600 mb-4">{error}</div>}

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Details
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="1234567890"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                className={`border rounded-md p-4 text-center transition ${
                  paymentMethod === "credit-card"
                    ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setPaymentMethod("credit-card")}
              >
                <div className="font-medium">Credit Card</div>
              </button>
              <button
                type="button"
                className={`border rounded-md p-4 text-center transition ${
                  paymentMethod === "paypal"
                    ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="font-medium">PayPal</div>
              </button>
              <button
                type="button"
                className={`border rounded-md p-4 text-center transition ${
                  paymentMethod === "apple-pay"
                    ? "border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setPaymentMethod("apple-pay")}
              >
                <div className="font-medium">Apple Pay</div>
              </button>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading || !cartItems.length}
                className={`w-full py-3 px-4 rounded-md font-medium transition ${
                  isLoading || !cartItems.length
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {isLoading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
