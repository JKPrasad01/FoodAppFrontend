import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, id) => {
    console.log("addToCart called:", { item, id });

    // Validate restaurantId
    if (id == null || isNaN(id) || id <= 0) {
      console.error("Invalid restaurant ID:", { item, id });
      toast.error(`Cannot add ${item.menuName || 'item'}: Invalid or missing restaurant ID`);
      throw new Error("Invalid or missing restaurant ID");
    }

    // Validate item
    if (!item || !item.menuId || !item.menuName || !item.price || !item.restaurantId) {
      console.error("Invalid item data:", item);
      toast.error("Cannot add item: Missing required item details");
      throw new Error("Invalid item data");
    }

    // Ensure item.restaurantId matches id
    if (item.restaurantId !== id) {
      console.error("Restaurant ID mismatch:", { itemRestaurantId: item.restaurantId, providedId: id });
      toast.error(`Cannot add ${item.menuName}: Item restaurant ID does not match`);
      throw new Error("Item restaurant ID mismatch");
    }

    // Ensure all items are from the same restaurant
    if (cartItems.length && restaurantId && restaurantId !== id) {
      console.warn("Restaurant mismatch:", { currentRestaurantId: restaurantId, newRestaurantId: id });
      toast.error(`Cannot add ${item.menuName}: All items must be from the same restaurant (ID: ${restaurantId})`);
      throw new Error("All items must be from the same restaurant");
    }

    setRestaurantId(id); // Set restaurantId on first item addition

    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.menuId === item.menuId);
      if (existingItem) {
        const updatedItems = prev.map((cartItem) =>
          cartItem.menuId === item.menuId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        toast.success(`${item.menuName} quantity updated in cart`);
        return updatedItems;
      }
      toast.success(`${item.menuName} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeCartItem = (menuId) => {
    setCartItems((prev) => {
      const item = prev.find((cartItem) => cartItem.menuId === menuId);
      if (item) {
        toast.info(`${item.menuName} removed from cart`);
      }
      const updatedItems = prev.filter((item) => item.menuId !== menuId);
      if (updatedItems.length === 0) {
        setRestaurantId(null);
      }
      return updatedItems;
    });
  };

  const updateQuantity = (menuId, delta) => {
    setCartItems((prev) => {
      const updatedItems = prev
        .map((item) =>
          item.menuId === menuId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);
      
      const item = prev.find((cartItem) => cartItem.menuId === menuId);
      if (item && delta > 0) {
        toast.success(`${item.menuName} quantity increased`);
      } else if (item && delta < 0) {
        toast.success(`${item.menuName} quantity decreased`);
      }
      if (updatedItems.length === 0) {
        setRestaurantId(null);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    toast.info("Cart cleared");
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (
          Array.isArray(parsedCart) &&
          parsedCart.every((item) => item.restaurantId && item.menuId && item.price && item.quantity)
        ) {
          const restaurantIds = new Set(parsedCart.map((item) => item.restaurantId));
          if (restaurantIds.size <= 1) {
            setCartItems(parsedCart);
            setRestaurantId(parsedCart[0]?.restaurantId || null);
          } else {
            console.warn("Invalid cart in localStorage: multiple restaurants detected");
            localStorage.removeItem("cartItems");
          }
        } else {
          console.warn("Invalid cart in localStorage: missing required fields");
          localStorage.removeItem("cartItems");
        }
      } catch (err) {
        console.error("Failed to parse cart from localStorage:", err);
        localStorage.removeItem("cartItems");
      }
    }
  }, []);

  useEffect(() => {
    if (cartItems.length) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        addToCart,
        removeCartItem, // Ensure this matches the defined function
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;