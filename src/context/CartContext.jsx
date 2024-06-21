import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [restaurantId, setRestaurantId] = useState(() => {
    const savedRestaurantId = localStorage.getItem('restaurantId');
    return savedRestaurantId ? savedRestaurantId : null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (cart.length === 0) {
      localStorage.removeItem('restaurantId');
      setRestaurantId(null);
    } else {
      localStorage.setItem('restaurantId', restaurantId);
    }
  }, [cart, restaurantId]);

  const addToCart = (item) => {
    if (!item.product || !item.name || !item.price || !item.restaurant) {
      console.error('Invalid item added to cart:', item);
      return;
    }

    if (restaurantId && restaurantId !== item.restaurant) {
      console.error('You can only add items from one restaurant at a time.');
      return;
    }

    setRestaurantId(item.restaurant);

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.product === item.product);
      if (existingItem) {
        return prevCart.map((i) =>
          i.product === item.product ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.product === item.product);
      if (existingItem.quantity === 1) {
        const updatedCart = prevCart.filter((i) => i.product !== item.product);
        if (updatedCart.length === 0) {
          setRestaurantId(null);
        }
        return updatedCart;
      } else {
        return prevCart.map((i) =>
          i.product === item.product ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  };

  const updateCartQuantity = (item, quantity) => {
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.product === item.product ? { ...i, quantity: quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, restaurantId, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};




