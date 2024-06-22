import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/RestaurantInfo.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RestaurantInfo = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="restaurant-info">
      <h2>{restaurant.name}</h2>
      <p>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}</p>
      <p>{restaurant.contact}</p>
    </div>
  );
};

export default RestaurantInfo;

