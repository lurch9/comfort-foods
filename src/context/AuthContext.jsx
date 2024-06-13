import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique IDs

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedGuestId = localStorage.getItem('guestId');
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedGuestId) {
      setGuestId(storedGuestId);
    } else {
      const newGuestId = uuidv4();
      setGuestId(newGuestId);
      localStorage.setItem('guestId', newGuestId);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setGuestId(uuidv4()); // Generate a new guest ID on logout
    localStorage.setItem('guestId', guestId);
  };

  return (
    <AuthContext.Provider value={{ user, guestId, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


