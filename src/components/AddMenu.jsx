import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      navigate('/manager-menus');
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

