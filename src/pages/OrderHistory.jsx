// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('orderStatusUpdated', ({ orderId, status }) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('orderStatusUpdated');
      }
    };
  }, [socket]);

  return (
    <div className="order-history-page">
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order #{order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.product}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>
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


