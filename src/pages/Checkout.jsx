// src/components/Checkout.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart } = useCart();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Mock submission handler
    alert('Order placed successfully!');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="checkout-page">
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Checkout</h2>
        <table className="checkout-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkout-total">
          <h3>Total: ${calculateTotal()}</h3>
        </div>
        <div className="checkout-details">
          <label>Name</label>
          <input type="text" required />
          <label>Address</label>
          <input type="text" required />
          <label>Card Details</label>
          <input type="text" required placeholder="Card Number" />
          <input type="text" required placeholder="Expiry Date" />
          <input type="text" required placeholder="CVC" />
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;



