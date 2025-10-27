import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, restaurantId, cartTotal, updateQuantity, removeCartItem, cartCount } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart {cartCount > 0 && `(${cartCount})`}</h2>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          {restaurantId && (
            <p className="text-gray-600 mb-4">Ordering from Restaurant ID: {restaurantId}</p>
          )}
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li key={item.menuId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-medium">{item.menuName}</h3>
                  <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.menuId, -1)}
                    className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuId, 1)}
                    className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeCartItem(item.menuId)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-2 border-t">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;