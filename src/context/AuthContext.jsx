import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = Cookies.get('token');
    if (token) {
      return { token, role: null, restaurantId: null }; // Initial state with token only, role and restaurantId will be determined after fetching user data
    }
    return { token: null, role: 'guest', restaurantId: null }; // Default to 'guest' when no token is found
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
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

  const login = (userData, rememberMe) => {
    const options = { secure: true, sameSite: 'Strict' };
    if (rememberMe) {
      options.expires = 30; // Set cookie to expire in 30 days
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















