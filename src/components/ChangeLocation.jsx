// src/components/ChangeLocation.jsx
import React, { useState } from 'react';
import { useLocationContext } from '../context/LocationContext';
import '../pages/form.css';

const ChangeLocation = () => {
  const { updateLocation } = useLocationContext();
  const [zip, setZip] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zip) {
      updateLocation(zip);
      setZip('');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="zip">Enter Zip Code:</label>
          <input
            id="zip"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
        <button type="submit">Change Location</button>
      </form>
    </div>
  );
};

export default ChangeLocation;


