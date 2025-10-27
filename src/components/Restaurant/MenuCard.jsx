import React from "react";
import { useCart } from "../../context/CartContext";

const MenuCard = ({ item, onAddToCart }) => {
  const { updateQuantity, cartItems } = useCart();
  const cartItem = cartItems.find((cartItem) => cartItem.menuId === item.menuId);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <img
        src={item.menuProfile ? `${item.menuProfile}` : "https://via.placeholder.com/150"}
        alt={item.menuName}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.menuName}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">Rating: {item.rating}</p>
      <p className="text-gray-600 dark:text-gray-300 font-medium">${item.price.toFixed(2)}</p>
      <div className="mt-4 flex items-center space-x-2">
        {quantity > 0 ? (
          <>
            <button
              onClick={() => updateQuantity(item.menuId, -1)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-gray-900 dark:text-white font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.menuId, 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              console.log("MenuCard onAddToCart:", { item, restaurantId: item.restaurantId });
              onAddToCart(); // Use onAddToCart prop instead of addToCart(item)
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;