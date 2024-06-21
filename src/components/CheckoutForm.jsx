import React, { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Assume you have an AuthContext to get the user info

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth(); // Get user info from AuthContext

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cart,
        restaurantId: cart.length > 0 ? cart[0].restaurant : null, // Assume all items are from the same restaurant
        customerId: user ? user._id : null,
      })
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  }, [cart, user]);

  const options = { fetchClientSecret };

  const handleCheckoutComplete = () => {
    clearCart(); // Clear the cart upon successful checkout
  };

  useEffect(() => {
    const handleStripeEvent = (event) => {
      if (event.type === 'stripeCheckoutComplete') {
        handleCheckoutComplete();
      }
    };

    window.addEventListener('stripeCheckoutComplete', handleStripeEvent);

    return () => {
      window.removeEventListener('stripeCheckoutComplete', handleStripeEvent);
    };
  }, []);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
        onComplete={handleCheckoutComplete} // Attach the onComplete handler
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;













