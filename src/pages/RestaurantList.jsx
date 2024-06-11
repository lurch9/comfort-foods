// src/pages/RestaurantList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './RestaurantList.css';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import ChangeLocation from '../components/ChangeLocation';
import mockRestaurants from '../mockData/mockRestaurants.json'; // Import mock data

const RestaurantList = () => {
  const { user } = useAuth();
  const { location, setLocation } = useLocationContext();
  const [restaurants, setRestaurants] = useState([]);
  const urlLocation = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(urlLocation.search);
    const zipQuery = query.get('zip');
    if (zipQuery) {
      setLocation(zipQuery);
      fetchRestaurants(zipQuery);
    } else if (location) {
      fetchRestaurants(location);
    } else if (user && user.zip) {
      setLocation(user.zip);
      fetchRestaurants(user.zip);
    }
  }, [urlLocation, user, location, setLocation]);

  const fetchRestaurants = async (zip) => {
    try {
      // Use mock data instead of actual API call
      // const response = await axios.get(`http://your-api-endpoint/restaurants?zip=${zip}`);
      setRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <div className="restaurant-list">
      <h2>Restaurants in {location}</h2>
      <ChangeLocation />
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
              <Link to={`/restaurants/${restaurant.id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants found.</p>
      )}
    </div>
  );
};

export default RestaurantList;








