import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/Dashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    contact: '',
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants/me', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurant(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRestaurant(null);
        } else {
          setError(error.response ? error.response.data.message : error.message);
        }
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [user.token]);

  const handleChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/restaurants', newRestaurant, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRestaurant(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)).toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Manager Dashboard</h2>
      {restaurant ? (
        <div className="dashboard-info">
          <p>Restaurant Name: {restaurant.name}</p>
          <p>Address: {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.zip}`}</p>
          <p>Contact: {restaurant.contact}</p>
          <button onClick={() => navigate(`/restaurants/${restaurant._id}/edit`)}>Edit Restaurant</button>
          <button onClick={() => navigate(`/restaurants/${restaurant._id}/menu`)}>Manage Menu</button>
        </div>
      ) : (
        <div>
          <p>No restaurant found. Please create one.</p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Restaurant Name" onChange={handleChange} required />
            <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" onChange={handleChange} required />
            <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
            <input type="text" name="contact" placeholder="Contact" onChange={handleChange} required />
            <button type="submit">Create Restaurant</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;



