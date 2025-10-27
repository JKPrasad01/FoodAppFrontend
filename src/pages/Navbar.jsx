import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMoon,
  FiSun,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiHeart,
  FiShoppingCart,
  FiClipboard,
  FiX,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, setUser }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, removeCartItem, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const cartRef = useRef(null);
  const searchRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      try {
        if (storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
  }, [user, setUser]);

  // Apply dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Navigation */}
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          FoodieApp
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FiHome className="mr-1" /> Home
          </Link>
        </div>
      </div>

      {/* Desktop Search Bar */}
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

      {/* Mobile Search Toggle */}
      <button
        onClick={() => setSearchOpen(true)}
        className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Search"
      >
        <FiSearch size={20} />
      </button>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 md:hidden">
          <div ref={searchRef} className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Search</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close search"
              >
                <FiX size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search restaurants, dishes..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-l-lg px-4 py-3 focus:outline-none text-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-r-lg flex items-center"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Actions */}
      <div className="flex items-center space-x-5">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
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
            aria-label="Shopping Cart"
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
                <h3 className="font-bold text-gray-900 dark:text-white">Your Cart ({cartCount} items)</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                      <FiShoppingCart className="text-gray-500 dark:text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">Your cart is empty</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add delicious items to get started</p>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.menuId}
                        className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center"
                      >
                        <img
                          src={
                            item.menuProfile
                              ? `${item.menuProfile}`
                              : "https://via.placeholder.com/64"
                          }
                          alt={item.menuName}
                          className="flex-shrink-0 w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">{item.menuName}</p>
                            <button
                              onClick={() => removeCartItem(item.menuId)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-600 dark:text-gray-300">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                            <p className="font-medium text-indigo-600 dark:text-indigo-400">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Link
                        to="/checkout"
                        onClick={() => setCartOpen(false)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center"
                      >
                        Proceed to Checkout
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
              aria-label="Profile menu"
            >
              <div className="relative">
                <img
                  src={user.userProfile || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="rounded-full w-10 h-10 object-cover border-2 border-transparent group-hover:border-indigo-500"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full w-3 h-3"></div>
              </div>
              <span className="hidden lg:block font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <img
                    src={user.userProfile || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="rounded-full w-12 h-12 object-cover mr-3"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FiUser className="mr-3 text-gray-500 dark:text-gray-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/orderHistory"
                    className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FiClipboard className="mr-3 text-gray-500 dark:text-gray-400" />
                    Order History
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FiSettings className="mr-3 text-gray-500 dark:text-gray-400" />
                    Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="w-full text-left flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-3 text-gray-500 dark:text-gray-400" />
                    Sign out
                  </button>
                </div>
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