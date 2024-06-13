import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    if (!item.product || !item.name || !item.price || !item.restaurant) {
      console.error('Invalid item added to cart:', item);
      return;
    }

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
        return prevCart.filter((i) => i.product !== item.product);
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
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};



