// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getEnv } from '../utils/env';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${getEnv('VITE_API_BASE_URL')}`);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;


