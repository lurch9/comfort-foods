import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/order/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>Order Status: {order.status}</p>
      <p>Total: ${order.total}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((item) => (
          <li key={item.product._id}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;













