import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getEnv } from '../utils/env';
import axios from 'axios';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const Return = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      console.log('Session ID:', sessionId);
      
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/confirmation/${sessionId}`);
        clearCart();
        navigate(`/order-confirmation/${data._id}`);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, clearCart]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default Return;




