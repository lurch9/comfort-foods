import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = Cookies.get('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [restaurantId, setRestaurantId] = useState(() => {
    return Cookies.get('restaurantId') || null;
  });

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    if (cart.length === 0) {
      Cookies.remove('restaurantId');
      setRestaurantId(null);
    } else {
      Cookies.set('restaurantId', restaurantId, { expires: 7 });
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
    Cookies.remove('cart');
    Cookies.remove('restaurantId');
  };

  return (
    <CartContext.Provider value={{ cart, restaurantId, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;





