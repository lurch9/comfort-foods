// src/components/ChangeLocation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';

const ChangeLocation = () => {
  const { setLocation } = useLocationContext();
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocation(zip);
    navigate(`/restaurants?zip=${zip}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="zip">Enter Zip Code:</label>
      <input
        id="zip"
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
      />
      <button type="submit">Change Location</button>
    </form>
  );
};

export default ChangeLocation;

