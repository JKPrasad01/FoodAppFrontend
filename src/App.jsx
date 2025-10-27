import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported
import { CartProvider } from "./context/CartContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";
import CheckoutPage from "./pages/CheckoutPage";
import UserPage from "./pages/UserPage";
import SuccessPage from "./pages/SuccessPage";
import FailedPage from "./pages/FailedPage";
import AddRestaurant from "./pages/AddRestaurant";
import Test from "./pages/Test";
import CustomRestaurantAdder from "./pages/CustomRestaurantAdder";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      console.log("Checking localStorage for user:", storedUser);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.userId && parsedUser.userEmail) {
            console.log("Restoring user:", parsedUser);
            setUser(parsedUser);
          } else {
            console.error("Invalid user data in localStorage:", parsedUser);
            localStorage.removeItem("user");
          }
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
        {showNavbar && <Navbar user={user} setUser={setUser} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup userData={setUser} />} />
          <Route path="/restaurant/:id" element={<Menu />} />
          <Route path="/orderHistory" element={<OrderHistory />} />
          <Route path="/checkout" element={<CheckoutPage user={user} />} />
          <Route path="/profile" element={<UserPage userData={user} setUserData={setUser} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failed" element={<FailedPage />} />
          <Route path="/restaurants/add" element={<AddRestaurant />} />
          <Route path="/test" element={<Test />} />
          <Route path="/customAdd" element={<CustomRestaurantAdder />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </CartProvider>
  );
}

export default App;