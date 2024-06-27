import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEnv } from '../utils/env';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../Styles/OrderConfirmation.css'; // Add this line to import the CSS file
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    const socket = io(`${API_BASE_URL}`);
    console.log('Socket object:', socket);

    socket.on('orderStatusUpdated', (update) => {
      console.log('Received update:', update);
      if (update.orderId === id) {
        setOrder((prevOrder) => ({ ...prevOrder, status: update.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-box">
        <h2>Order Confirmation</h2>
        <p>Order ID: {order._id}</p>
        <p>Total: ${order.total}</p>
        <h3>Items:</h3>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} x {item.quantity}
            </li>
          ))}
        </ul>
        <p>Status: {order.status}</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;




