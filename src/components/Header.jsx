import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import '../Styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <h1>Comfort Foods</h1>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <nav ref={menuRef} className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          {user && user.role !== 'guest' && (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              </li>
              {user.role === 'manager' && (
                <li>
                  <Link to="/manager-dashboard" onClick={() => setIsMenuOpen(false)}>Manager Dashboard</Link>
                </li>
              )}
              <li>
                <Link to="/order-history" onClick={() => setIsMenuOpen(false)}>Orders</Link>
              </li>
              <li>
                <Link to="/" onClick={() => { setIsMenuOpen(false); logout(); }}>Logout</Link>
              </li>
            </>
          )}
          {!user || user.role === 'guest' ? (
            <>
              <li>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
      <div className="cart-icon-wrapper">
        <Link to="/cart">
          <div className="cart-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
            {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;


















