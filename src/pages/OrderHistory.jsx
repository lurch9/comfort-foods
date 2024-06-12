// src/components/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
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

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.name} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>Total: ${order.total.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no order history.</p>
      )}
    </div>
  );
};

export default OrderHistory;

