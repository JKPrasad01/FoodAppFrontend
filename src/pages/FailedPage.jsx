import React from 'react';
import { Link } from 'react-router-dom';

const FailedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          Sorry, there was an issue processing your payment. Please try again.
        </p>
        <Link
          to="/checkout"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default FailedPage;