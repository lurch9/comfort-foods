import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      const response = await axios.post('http://localhost:5000/api/menus', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFormData({ name: '', restaurantId: user.restaurantId }); // Reset form data
      setError('');
      if (onMenuCreated) onMenuCreated(); // Notify parent component
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


