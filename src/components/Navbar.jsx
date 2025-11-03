import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMoon,
  FiSun,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShoppingCart,
  FiClipboard,
  FiX,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function Navbar({ user, setUser }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartItems, removeCartItem, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const cartRef = useRef(null);

  // ✅ Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      toast.info("You have been signed out.", { autoClose: 1500 });
      navigate("/login");
    }
  };

  // ✅ Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // ✅ Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target))
        setCartOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Auto-close menus on route change
  useEffect(() => {
    setProfileOpen(false);
    setCartOpen(false);
  }, [location]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        FoodieApp
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <FiSearch className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search restaurants, dishes..."
          className="bg-transparent px-3 w-full focus:outline-none text-gray-800 dark:text-gray-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Right Icons */}
      <div className="flex items-center space-x-5">
        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Cart */}
        <div className="relative" ref={cartRef}>
          <button
            onClick={() => {
              setCartOpen(!cartOpen);
              setProfileOpen(false);
            }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
          >
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {cartOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Your Cart ({cartCount})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.menuId}
                        className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center"
                      >
                        <img
                          src={
                            item.menuProfile || "https://via.placeholder.com/64"
                          }
                          alt={item.menuName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.menuName}
                            </p>
                            <button
                              onClick={() => removeCartItem(item.menuId)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-700 dark:text-gray-300">
                          Subtotal
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        to="/checkout"
                        onClick={() => setCartOpen(false)}
                        className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center"
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setCartOpen(false);
              }}
              className="flex items-center space-x-2 group"
            >
              {user.userProfile ? (
                <img
                  src={user.userProfile}
                  alt="Profile"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/100")
                  }
                  className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <img
                    src={user.userProfile || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiUser className="mr-3" /> My Profile
                </Link>
                <Link
                  to="/orderHistory"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiClipboard className="mr-3" /> Order History
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiSettings className="mr-3" /> Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FiLogOut className="mr-3" /> Sign out
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
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
