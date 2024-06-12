// src/pages/RestaurantInfo.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockRestaurants from '../mockData/mockRestaurants.json';
import '../Styles/RestaurantInfo.css';

const RestaurantInfo = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = () => {
      const restaurantData = mockRestaurants.find(rest => rest.id === id);
      setRestaurant(restaurantData);
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="restaurant-info">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <p>Address: {restaurant.address}</p>
      <p>Contact: {restaurant.contact}</p>
      <Link to={`/restaurants/${restaurant.id}/menu`}>View Menu</Link>
    </div>
  );
};

export default RestaurantInfo;

