import React, { useState } from 'react';
import axios from 'axios';
import { getEnv } from '../utils/env';

const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const AddProductForm = ({ restaurantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/menus/${restaurantId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Error adding product');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <button type="submit">Add Product</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default AddProductForm;



