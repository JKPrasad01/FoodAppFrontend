import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/ProtectedRoute";
 

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
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import { useState } from "react";

function App() {
  const[user,setUser]=useState();
  return (
    
          <>
          <Routes>

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>

            <Route element={<Layout user={user} setUser={setUser} />}>
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:id" element={<Menu />} />
                <Route path="/orderHistory" element={<OrderHistory />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<UserPage />} />

                {/* Admin Routes */}
                <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                  <Route path="/restaurants/add" element={<AddRestaurant />} />
                </Route>

                {/* Admin + Manager */}
                <Route element={<ProtectedRoute roles={["ADMIN", "MANAGER"]} />}>
                  <Route path="/customAdd" element={<CustomRestaurantAdder />} />
                </Route>

                <Route path="/success" element={<SuccessPage />} />
                <Route path="/failed" element={<FailedPage />} />
              </Route>
            </Route>

          </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
        </>
  );
}

export default App;
