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

  //  Fetch current user details if JWT/cookie exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/auth/user/fetch-user`, {
          credentials: "include",
        });
        if (!res.ok) {
          console.error(
            "User details fetch failed",
            res.status,
            await res.text()
          );
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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
          <Route path="/profile" element={<UserPage />} />
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
