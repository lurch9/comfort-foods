import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnv } from '../utils/env';

const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const AddMenu = ({ onMenuCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', restaurantId: user.restaurantId });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/menus`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFormData({ name: '', restaurantId: user.restaurantId }); // Reset form data
      setError('');
      if (onMenuCreated) onMenuCreated(response.data); // Notify parent component with new menu data
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Menu</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Menu Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <button type="submit">Create Menu</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddMenu;



