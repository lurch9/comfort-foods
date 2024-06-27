import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getEnv } from '../utils/env';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../Styles/OrderHistory.css';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="order-history-page">
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h3>Order #{order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.product}>
                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <Link to={`/order-confirmation/${order._id}`}>
                <button>View Order</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no past orders.</p>
      )}
    </div>
  );
};

export default OrderHistory;








