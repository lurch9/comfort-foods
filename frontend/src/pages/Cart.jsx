import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../Styles/Cart.css';

const Cart = () => {
  const { cart, updateCartQuantity, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [customQuantity, setCustomQuantity] = useState({});

  const handleDropdownChange = (item, value) => {
    if (value === '10+') {
      setCustomQuantity((prev) => ({ ...prev, [item.product]: '' }));
    } else {
      updateCartQuantity(item, parseInt(value, 10));
      setCustomQuantity((prev) => ({ ...prev, [item.product]: undefined }));
    }
  };

  const handleCustomQuantityChange = (item, quantity) => {
    if (/^[0-9]*$/.test(quantity)) {
      setCustomQuantity((prev) => ({ ...prev, [item.product]: quantity }));
    }
  };

  const handleCustomQuantityBlur = (item) => {
    const quantity = customQuantity[item.product];
    const quantityNumber = parseInt(quantity, 10);
    if (!isNaN(quantityNumber) && quantityNumber > 0) {
      updateCartQuantity(item, quantityNumber);
    } else {
      updateCartQuantity(item, 1); // Default to 1 if the input is invalid or less than 1
    }
    setCustomQuantity((prev) => ({ ...prev, [item.product]: undefined }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h2 data-cy="cart-title">Your Cart</h2>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={item.product} className="cart-item" data-cy={`cart-item-${index}`}>
                <h3 data-cy={`item-name-${index}`}>{item.name}</h3>
                <p data-cy={`item-description-${index}`}>{item.description}</p>
                <p data-cy={`item-price-${index}`}>{item.price}</p>
                <div className="quantity-control" data-cy={`quantity-control-${index}`}>
                  <button onClick={() => removeFromCart(item)} className="remove-button" data-cy={`remove-button-${index}`}>-</button>
                  {customQuantity[item.product] !== undefined ? (
                    <input
                      type="text"
                      value={customQuantity[item.product]}
                      onChange={(e) => handleCustomQuantityChange(item, e.target.value)}
                      onBlur={() => handleCustomQuantityBlur(item)}
                      className="custom-quantity-input"
                      data-cy={`custom-quantity-input-${index}`}
                    />
                  ) : (
                    <select
                      value={item.quantity > 9 ? '10+' : item.quantity}
                      onChange={(e) => handleDropdownChange(item, e.target.value)}
                      data-cy={`quantity-select-${index}`}
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                      <option value="10+">10+</option>
                    </select>
                  )}
                  <button onClick={() => addToCart(item)} className="add-button" data-cy={`add-button-${index}`}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total" data-cy="cart-total">
            <h3>Total: ${calculateTotal()}</h3>
          </div>
          <button className="checkout-button" onClick={handleCheckout} data-cy="checkout-button">
            Proceed to Checkout
          </button>
        </>
      ) : (
        <p data-cy="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
  
};

export default Cart;












