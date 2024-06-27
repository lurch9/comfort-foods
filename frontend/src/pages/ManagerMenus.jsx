import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddMenu from '../components/AddMenu';
import { getEnv } from '../utils/env';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css'; // Add any custom styles here
import '../Styles/ManagerMenus.css'; // Create and use this new CSS file for styling

const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const ManagerMenus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      if (!user.restaurantId) {
        setError('Restaurant ID not found for this user');
        setLoading(false);
        return;
      }
      try {
        console.log(`Fetching menus for restaurant ID: ${user.restaurantId}`);
        const response = await axios.get(`${API_BASE_URL}/api/menus/restaurant/${user.restaurantId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMenus(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching menus:', error);
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchMenus();
  }, [user.restaurantId, user.token]);

  const handleDelete = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/menus/${menuId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMenus(menus.filter(menu => menu._id !== menuId));
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const handleMenuCreated = (newMenu) => {
    setMenus([...menus, newMenu]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Manage Menus</h2>
      <div className="menus-container">
        {menus.length === 0 ? (
          <p>You currently have no menus.</p>
        ) : (
          menus.map((menu) => (
            <div className="menu-box" key={menu._id}>
              <h3>{menu.name}</h3>
              <button onClick={() => navigate(`/edit-menu/${menu._id}`)}>Edit Menu</button>
              <button onClick={() => handleDelete(menu._id)}>Delete Menu</button>
            </div>
          ))
        )}
      </div>
      <AddMenu onMenuCreated={handleMenuCreated} />
    </div>
  );
};

export default ManagerMenus;
