import React, { useCallback, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe("pk_test_51KcSZfJ9B14vTktU8rEamC55sJnjNCusYu6RfRMgj3yRjQdUHRAuizp394lxmHvq5UPCe3vh4Ws5Rewg8sAbBZmG00dnjeLEtr");

const CheckoutForm = () => {
  const { cart } = useCart();

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cart })
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  }, [cart]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;








