import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <p>Order Number: {order._id}</p>
      <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <div>
        <h3>Restaurant Information</h3>
        <p>{order.items.map(item => item.restaurant.name).join(', ')}</p>
      </div>
      <div>
        <h3>Customer Details</h3>
        <p>{order.customer.name}</p>
        <p>{order.customer.email}</p>
      </div>
      <div>
        <h3>Shipping Address</h3>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
      </div>
      <div>
        <h3>Ordered Items</h3>
        <ul>
          {order.items.map((item) => (
            <li key={item.product}>
              {item.name} - {item.quantity} x ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Order Summary</h3>
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Taxes: ${order.taxes.toFixed(2)}</p>
        <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
      </div>
      <div>
        <h3>Order Status</h3>
        <p>{order.status}</p>
      </div>
    </div>
  );
};

export default OrderDetails;












