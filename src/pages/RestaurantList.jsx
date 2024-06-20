// src/pages/RestaurantList.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/RestaurantList.css';

const RestaurantList = () => {
  const [zip, setZip] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/zip?zip=${zip}`);
      setRestaurants(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-list-container">
      <h2>Restaurants</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter ZIP Code"
          required
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <div className="restaurant-list">
          {restaurants.length === 0 ? (
            <p>No restaurants found for the provided zip code.</p>
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant._id} className="restaurant-box">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}</p>
                <p>Contact: {restaurant.contact}</p>
                <Link to={`/restaurants/${restaurant._id}/menu`} className="view-menu-link">View Menu</Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
















