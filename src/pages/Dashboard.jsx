// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/Dashboard.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)).toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-info">
        <p>Name: {data.name}</p>
        <p>Email: {data.email}</p>
        <p>Address: {`${data.street}, ${data.city}, ${data.state}, ${data.zip}`}</p>
        <p>Date of Birth: {formatDate(data.dateOfBirth)}</p>
        <button onClick={() => navigate('/profile')}>Edit Profile</button>
      </div>
      {/* Add more user-specific data here */}
    </div>
  );
};

export default Dashboard;


