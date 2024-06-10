// src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [zipCode, setZipCode] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (zipCode) {
      navigate(`/restaurants?zip=${zipCode}`);
    }
  };

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


