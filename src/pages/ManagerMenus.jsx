import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManagerMenus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      console.log('Token:', user.token); // Debugging token
      try {
        const response = await axios.get(`http://localhost:5000/api/menus/restaurant/${user.restaurantId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMenus(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchMenus();
  }, [user.token, user.restaurantId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menus/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMenus(menus.filter(menu => menu._id !== id));
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Manage Menus</h2>
      {menus.length === 0 ? (
        <p>No menus found. Please create one.</p>
      ) : (
        <ul>
          {menus.map(menu => (
            <li key={menu._id}>
              <h3>{menu.name}</h3>
              <button onClick={() => navigate(`/edit-menu/${menu._id}`)}>Edit</button>
              <button onClick={() => handleDelete(menu._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/add-menu')}>Add Menu</button>
    </div>
  );
};

export default ManagerMenus;







