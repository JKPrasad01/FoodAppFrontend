import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiList } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function Navbar({ user, setUser }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logged out successfully", { autoClose: 1500 });
      } else {
        toast.error("Logout failed", { autoClose: 1500 });
      }
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed", { autoClose: 1500 });
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        FoodieApp
      </Link>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* My Orders (Visible only if logged in) */}
        {user && (
          <Link
            to="/orderHistory"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center"
          >
            <FiList size={20} className="mr-1" /> My Orders
          </Link>
        )}

        {/* Cart */}
        <Link
          to="/checkout"
          className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FiShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Profile / Auth */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user.userProfile ? (
                <img
                  src={user.userProfile}
                  alt="Profile"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiUser className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
