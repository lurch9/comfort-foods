// src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import '../Styles/LandingPage.css';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [zipCode, setZipCode] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (zipCode) {
      navigate(`/restaurants?zip=${zipCode}`);
    }
  };

  // Redirect to restaurants page if user is logged in
  if (user) {
    return <Navigate to="/restaurants" />;
  }

  return (
    <div className="landing-page">
      <h1>Welcome to Comfort Foods</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter your zip code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
        <button type="submit">Search Restaurants</button>
      </form>
    </div>
  );
};

export default LandingPage;


