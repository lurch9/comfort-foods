// src/components/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <label>Zip Code</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            placeholder="Card Number"
          />
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            placeholder="Expiry Date"
          />
          <label>CVC</label>
          <input
            type="text"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            required
            placeholder="CVC"
          />
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;




