import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getEnv } from '../utils/env';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const EditRestaurant = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    contact: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const { name, address, contact } = response.data;
        setFormData({
          name,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          contact,
        });
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/restaurants/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/manager-dashboard');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Street:
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        </label>
        <label>
          City:
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>
        <label>
          State:
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </label>
        <label>
          ZIP:
          <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
        </label>
        <label>
          Contact:
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
        </label>
        <button type="submit">Update Restaurant</button>
      </form>
    </div>
  );
};

export default EditRestaurant;

