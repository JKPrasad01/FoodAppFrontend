import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuCard from "../components/Restaurant/MenuCard";
import { useCart } from "../context/CartContext";
import { uniAPi } from "../api/uniAPi";

const Menu = () => {
  const { id } = useParams(); // Get restaurant ID from URL
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Validate restaurant ID immediately
  const restaurantId = id && !isNaN(id) ? parseInt(id) : null;

  useEffect(() => {
    if (!restaurantId) {
      setError("Invalid or missing restaurant ID");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        const res = await uniAPi.get(`/restaurants/getAllMenu/${restaurantId}`);
        // if (!res.ok) {
        //   throw new Error("Failed to fetch menu");
        // }
        const data = await res.data;
        const enrichedData = data.map((item) => ({
          ...item,
          restaurantId,
        }));
        setMenuItems(enrichedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  if (!restaurantId) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error: Invalid or missing restaurant ID. Please select a valid
        restaurant.
        <button
          onClick={() => navigate("/restaurants")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Restaurants
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {menuItems.map((item) => (
          <MenuCard
            key={item.menuId}
            item={item}
            onAddToCart={() => addToCart(item, restaurantId)} // Pass validated restaurantId
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
