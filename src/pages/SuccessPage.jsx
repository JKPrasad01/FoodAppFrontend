import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order #ORD-7829 has been placed successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orderHistory"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;