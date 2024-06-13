import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/RestaurantList.css';

const RestaurantList = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [zipCode, setZipCode] = useState(user?.zip || '');
  const [inputZipCode, setInputZipCode] = useState(user?.zip || '');

  useEffect(() => {
    if (zipCode) {
      const fetchRestaurants = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/restaurants?zipCode=${zipCode}`);
          setRestaurants(response.data);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
        }
      };

      fetchRestaurants();
    }
  }, [zipCode]);

  const handleZipCodeChange = (event) => {
    setInputZipCode(event.target.value);
  };

  const handleZipCodeSubmit = (event) => {
    event.preventDefault();
    setZipCode(inputZipCode);
  };

  return (
    <div className="restaurant-list-page">
      <h2>Restaurants</h2>
      <form onSubmit={handleZipCodeSubmit} className="zip-code-form">
        <label>
          Enter Zip Code:
          <input
            type="text"
            value={inputZipCode}
            onChange={handleZipCodeChange}
            required
            pattern="\d{5}"
            title="Please enter a valid 5-digit zip code"
          />
        </label>
        <button type="submit">Search</button>
      </form>
      {restaurants.length > 0 ? (
        <ul className="restaurant-list">
          {restaurants.map((restaurant) => (
            <li key={restaurant._id} className="restaurant-item">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
              <p>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zip}</p>
              <Link to={`/restaurants/${restaurant._id}/menu`}>View Menu</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants found for the provided zip code.</p>
      )}
    </div>
  );
};

export default RestaurantList;











