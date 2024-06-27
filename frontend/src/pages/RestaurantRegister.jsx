import React, { useState } from 'react';
import axios from 'axios';

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    contact: '',
    description: '',
    role: 'restaurant'
  });

  const [error, setError] = useState('');
  const { name, email, password, street, city, state, zip, contact, description } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify(formData);
      const res = await axios.post('/api/restaurants/register', body, config);
      console.log(res.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="restaurant-registration">
      <h2>Restaurant Registration</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="street">Street</label>
          <input type="text" id="street" name="street" value={street} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={city} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={state} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="zip">Zip Code</label>
          <input type="text" id="zip" name="zip" value={zip} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="contact">Contact</label>
          <input type="text" id="contact" name="contact" value={contact} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={onChange} required></textarea>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RestaurantRegister;








