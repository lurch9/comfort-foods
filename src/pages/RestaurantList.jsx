import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import '../Styles/RestaurantList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const libraries = ['places'];
const googleMapsApiKey = import.meta.env.VITE_MAPS_API;

const RestaurantList = () => {
  const [address, setAddress] = useState('');
  const [proximity, setProximity] = useState(5); // Default proximity in miles
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
          handleSearch(latitude, longitude); // Perform search immediately
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLoading(false); // Stop loading if geolocation is not available
        }
      );
    } else {
      setLoading(false); // Stop loading if geolocation is not available
    }
  }, []);
  

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`);
      if (response.data.status === 'OK') {
        const address = response.data.results[0].formatted_address;
        setAddress(address);
      } else {
        console.error('Error in reverse geocoding:', response.data);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const places = autocomplete.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      setAddress(place.formatted_address);

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocation({ lat, lng });

      console.log('Location set to:', { lat, lng });
    }
  };

  const handleSearch = async (latitude, longitude) => {
    const lat = latitude || (location ? location.lat : null);
    const lng = longitude || (location ? location.lng : null);
  
    if (!lat || !lng) {
      setError('Please select a valid address.');
      return;
    }
  
    setLoading(true);
    setError('');
    setSearched(true); // Indicate that a search has been performed
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/near`, {
        params: { lat: lat, lon: lng, maxDistance: proximity * 1609.34 } // Convert miles to meters
      });
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="restaurant-list-container">
      <h2>Restaurants</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <StandaloneSearchBox
          onLoad={(ref) => setAutocomplete(ref)}
          onPlacesChanged={handlePlaceChanged}
        >
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            required
          />
        </StandaloneSearchBox>
        <div>
          <label>
            Proximity (miles)
            <input
              type="number"
              value={proximity}
              onChange={(e) => setProximity(e.target.value)}
              min="1"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <div className="restaurant-list">
          {restaurants.length === 0 ? (
            <div className="restaurant-box">
              <p>Enter your address and hit search to find registered restaurants near you!</p>
            </div>
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






















