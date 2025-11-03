import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";
import CheckoutPage from "./pages/CheckoutPage";
import UserPage from "./pages/UserPage";
import AddRestaurant from "./pages/AddRestaurant";
import CustomRestaurantAdder from "./pages/CustomRestaurantAdder";
import SuccessPage from "./pages/SuccessPage";
import FailedPage from "./pages/FailedPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { CartProvider } from "./context/CartContext";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
  try {
    // Call your backend endpoint that returns current user info
    const res = await fetch("http://localhost:8080/auth/user/api/auth/me", {
      credentials: "include", // very important: send cookie with request
    });

    if (!res.ok) {
      console.error("Failed to fetch user:", res.status);
      setUser(null);
      return;
    }

    const data = await res.json();
    setUser(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  // Run once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // When user logs in successfully → refresh user info
  const handleLoginSuccess = async () => {
    await fetchUser();
    navigate("/"); // redirect to home after successful login
  };

  if (loading) return <div>Loading...</div>;

  return (
    <CartProvider>
      {user && <Navbar user={user} setUser={setUser} />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<Menu />} />
          <Route path="/orderHistory" element={<OrderHistory />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<UserPage userData={user} setUserData={setUser} />}
/>

          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failed" element={<FailedPage />} />

          {/* Role-based Routes */}
          <Route
            element={<ProtectedRoute user={user} allowedRoles={["ADMIN"]} />}
          >
            <Route path="/restaurants/add" element={<AddRestaurant />} />
          </Route>

          <Route
            element={
              <ProtectedRoute user={user} allowedRoles={["ADMIN", "MANAGER"]} />
            }
          >
            <Route path="/customAdd" element={<CustomRestaurantAdder />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </CartProvider>
  );
}

export default App;
