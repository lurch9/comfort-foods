import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      return { token, role: null, restaurantId: null }; // Initial state with token only, role and restaurantId will be determined after fetching user data
    }
    return { token: null, role: 'guest', restaurantId: null }; // Default to 'guest' when no token is found
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ ...response.data, token });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout(); // Logout on failure to fetch user profile
        }
      }
    };

    if (user.token && user.role === null) {
      fetchUser();
    }
  }, [user.token]);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser({ token: null, role: 'guest', restaurantId: null });
  };

  console.log('AuthContext - User:', user); // Debugging user

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;














