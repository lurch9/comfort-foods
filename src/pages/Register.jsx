import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/form.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    rememberMe: false, // Add rememberMe field
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login method to set user and handle cookies

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, formData);
      const userData = response.data;
      login(userData, formData.rememberMe); // Use the login method from the context

      // Redirect based on user role
      if (userData.role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Name" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="street">Street:</label>
          <input type="text" id="street" name="street" placeholder="Street" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input type="text" id="city" name="city" placeholder="City" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input type="text" id="state" name="state" placeholder="State" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="zip">ZIP Code:</label>
          <input type="text" id="zip" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" onChange={handleChange} required>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe">Remember me for 30 days</label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;



