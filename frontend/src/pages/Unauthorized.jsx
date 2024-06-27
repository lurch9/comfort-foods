import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Unauthorized.css'; // Import the new CSS file

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h2>Unauthorized</h2>
      <p className="centered-text">You do not have permission to view this page.</p>
      <div className="button-container">
        <Link to="/login" className="button-link">Login</Link>
        <Link to="/register" className="button-link">Register</Link>
      </div>
    </div>
  );
};

export default Unauthorized;



