import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    dateOfBirth: '',
    role: 'user', // default to 'user'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      const userData = response.data;
      setUser(userData); // Set the user data in context
      localStorage.setItem('token', userData.token); // Save the token to local storage

      // Redirect based on user role
      if (userData.role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/restaurants');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
        <input type="text" name="state" placeholder="State" onChange={handleChange} required />
        <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
        <input type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} required />
        <select name="role" onChange={handleChange} required>
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

