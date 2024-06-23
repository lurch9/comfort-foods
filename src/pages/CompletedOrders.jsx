import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/Dashboard.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompletedOrders = ({ restaurantId }) => {
  const { user } = useAuth();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders/completed/${restaurantId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCompletedOrders(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, [restaurantId, user.token]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCompletedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="order-list">
      <h3>Completed Orders</h3>
      {completedOrders.length === 0 ? (
        <p>No completed orders found.</p>
      ) : (
        completedOrders.map((order) => (
          <div key={order._id} className="order-box">
            <h4>Order #{order._id}</h4>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>
            <p>Ordered at: {new Date(order.createdAt).toLocaleDateString()}</p>
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
                onClick={() => handleOrderStatusUpdate(order._id, 'accepted')}
              >
                Accept
              </button>
              <button
                className={order.status === 'preparing' ? 'preparing' : ''}
                onClick={() => handleOrderStatusUpdate(order._id, 'preparing')}
              >
                Prepare
              </button>
              <button
                className={order.status === 'completed' ? 'completed' : ''}
                onClick={() => handleOrderStatusUpdate(order._id, 'completed')}
              >
                Complete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedOrders;
