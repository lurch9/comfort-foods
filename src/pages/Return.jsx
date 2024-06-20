// src/pages/Return.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      // Redirect to a success page or display a success message
      navigate('/order-success');
    }
  }, [status, navigate]);

  return (
    <div>
      {status === 'complete' ? (
        <div>
          <h2>Payment Successful</h2>
          <p>
            We appreciate your business! A confirmation email will be sent to {customerEmail}.
          </p>
        </div>
      ) : (
        <div>
          <h2>Processing...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      )}
    </div>
  );
};

export default Return;

