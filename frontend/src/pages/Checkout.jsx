import React, { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout, Elements } from '@stripe/react-stripe-js';
import { getEnv } from '../utils/env';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../Styles/Checkout.css'
const API_BASE_URL = getEnv('VITE_API_BASE_URL');
const stripePromise = loadStripe(getEnv('VITE_STRIPE_PUBLIC_KEY'));

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth(); // Get user info from AuthContext

  const fetchClientSecret = useCallback(async () => {
    console.log('fetchClientSecret called');
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
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

    console.log('Response received:', response);
    const textResponse = await response.text();
    console.log('Response text:', textResponse);

    try {
      const jsonResponse = JSON.parse(textResponse);
      console.log('Parsed JSON response:', jsonResponse);
      return jsonResponse.clientSecret;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw error;
    }
  }, [cart, user]);

  const options = { fetchClientSecret };

  const handleCheckoutComplete = () => {
    console.log('Checkout completed!');
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

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <div className="checkout-container">
      <h2>Checkout</h2>
      <CheckoutForm />
    </div>
  </Elements>
);

export default Checkout;



















