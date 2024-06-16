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

  const { name, email, password, street, city, state, zip, contact, description } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
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
      console.error(err.response.data);
      // Handle registration error
    }
  };

  return (
    <div className="restaurant-registration">
      <h2>Restaurant Registration</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <div>
          <label>Street</label>
          <input type="text" name="street" value={street} onChange={onChange} required />
        </div>
        <div>
          <label>City</label>
          <input type="text" name="city" value={city} onChange={onChange} required />
        </div>
        <div>
          <label>State</label>
          <input type="text" name="state" value={state} onChange={onChange} required />
        </div>
        <div>
          <label>Zip Code</label>
          <input type="text" name="zip" value={zip} onChange={onChange} required />
        </div>
        <div>
          <label>Contact</label>
          <input type="text" name="contact" value={contact} onChange={onChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} required></textarea>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RestaurantRegister;







