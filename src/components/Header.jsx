// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-left">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <div className="logo">
          <h1>Comfort Foods</h1>
        </div>
        <ul className="nav-right">
          {user ? (
            <>
              <li>
                <Link to="/cart">
                  <div className="cart-icon">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={logout}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;













