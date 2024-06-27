import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getEnv } from '../utils/env';
import { useAuth } from '../context/AuthContext';
import CompletedOrders from '../components/CompletedOrders'; // Import the new component
import '../Styles/Dashboard.css';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const ManagerDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    contact: '',
  });
  const [showCompletedOrders, setShowCompletedOrders] = useState(false); // State to toggle completed orders view

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/restaurants/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurant(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRestaurant(null);
        } else {
          setError(error.response ? error.response.data.message : error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [user.token]);

  useEffect(() => {
    if (restaurant) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/orders/restaurant`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setOrders(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setOrders([]);
          } else {
            setError(error.response ? error.response.data.message : error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [restaurant, user.token]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (status === 'completed') {
        // Remove the order from the list if it is completed
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      } else {
        // Otherwise, update the status in the orders list
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/restaurants`, newRestaurant, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRestaurant(response.data);
      setUser((prevUser) => ({ ...prevUser, restaurantId: response.data._id }));
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/restaurants/${restaurant._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurant(null);
        setUser((prevUser) => ({ ...prevUser, restaurantId: null }));
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)).toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Restaurant Dashboard</h2>
      {restaurant ? (
        <div className="dashboard-info">
          <p>Restaurant Name: {restaurant.name}</p>
          <p>Address: {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.zip}`}</p>
          <p>Contact: {restaurant.contact}</p>
          <div className="inline-buttons">
            <button onClick={() => navigate(`/edit-restaurant/${restaurant._id}`)}>Edit Restaurant</button>
            <button onClick={() => navigate(`/manager-menus/${restaurant._id}`)}>Manage Menus</button>
            <button onClick={handleDelete}>Delete Restaurant</button>
            <button onClick={() => setShowCompletedOrders(!showCompletedOrders)}>
              {showCompletedOrders ? 'Hide Completed Orders' : 'Show Completed Orders'}
            </button>
          </div>
          <h3>Orders</h3>
          {orders.length === 0 ? (
            <p>No orders found for this restaurant.</p>
          ) : (
            <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-box">
                <h4 data-cy={`order-id-${order._id}`}>Order #{order._id}</h4>
                <p data-cy={`order-status-${order._id}`}>Status: {order.status}</p>
                <p data-cy={`order-total-${order._id}`}>Total: ${order.total}</p>
                <p>Ordered at: {formatDate(order.createdAt)}</p>
                <h5>Items:</h5>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.name} - ${item.price}
                    </li>
                  ))}
                </ul>
                <div className="status-buttons">
                  <button
                    className={order.status === 'accepted' ? 'accepted' : ''}
                    data-cy={`order-accept-${order._id}`}
                    onClick={() => handleOrderStatusUpdate(order._id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className={order.status === 'preparing' ? 'preparing' : ''}
                    data-cy={`order-prepare-${order._id}`}
                    onClick={() => handleOrderStatusUpdate(order._id, 'preparing')}
                  >
                    Prepare
                  </button>
                  <button
                    className={order.status === 'completed' ? 'completed' : ''}
                    data-cy={`order-complete-${order._id}`}
                    onClick={() => handleOrderStatusUpdate(order._id, 'completed')}
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>          
          )}
          {showCompletedOrders && <CompletedOrders restaurantId={restaurant._id} />} {/* Show the completed orders component */}
        </div>
      ) : (
        <div>
          <p>No restaurant found. Please create one.</p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Restaurant Name" onChange={handleChange} required />
            <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" onChange={handleChange} required />
            <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
            <input type="text" name="contact" placeholder="Contact" onChange={handleChange} required />
            <button type="submit">Create Restaurant</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
























