import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiShoppingCart, FiList } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // -------------------------------
  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  // -------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // -------------------------------

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        FoodieApp
      </Link>

      <div className="flex items-center space-x-6">

        {user && (
          <Link to="/orderHistory" className="flex items-center text-gray-700">
            <FiList className="mr-1" /> My Orders
          </Link>
        )}

        {/* Cart */}
        <Link to="/checkout" className="relative">
          <FiShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setProfileOpen(!profileOpen)}>
              {user.userProfile ? (
                <img
                  src={user.userProfile}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg border w-40 py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiUser className="inline mr-2" /> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/signup"
              className="bg-indigo-600 px-4 py-2 text-white rounded-lg"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
