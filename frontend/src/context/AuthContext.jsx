import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getEnv } from '../utils/env';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = Cookies.get('token');
    if (token) {
      return { token, role: null, restaurantId: null };
    }
    return { token: null, role: 'guest', restaurantId: null };
  });

  useEffect(() => {
    console.log("useEffect triggered with user:", user);

    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get(`${getEnv('VITE_API_BASE_URL')}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ ...response.data, token });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      }
    };

    if (user.token && user.role === null) {
      console.log("Fetching user profile...");
      fetchUser();
    }
  }, [user.token]);

  const login = (userData, rememberMe) => {
    const options = { secure: true, sameSite: 'Strict' };
    if (rememberMe) {
      options.expires = 30;
    }
    Cookies.set('token', userData.token, options);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser({ token: null, role: 'guest', restaurantId: null });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;




















