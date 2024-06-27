import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { io } from 'socket.io-client';
import { getEnv } from '../../utils/env';
import { SocketProvider, useSocket } from '../../context/SocketContext';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  return {
    io: jest.fn(),
  };
});

// Mock getEnv
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

const TestComponent = () => {
  const socket = useSocket();

  return (
    <div>
      {socket ? 'Socket Connected' : 'No Socket'}
    </div>
  );
};

describe('SocketContext', () => {
  let mockSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      close: jest.fn(),
    };

    io.mockReturnValue(mockSocket);
    getEnv.mockReturnValue('http://localhost:5000');
  });

  test('initializes socket connection', () => {
    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );

    expect(io).toHaveBeenCalledWith('http://localhost:5000');
    expect(screen.getByText('Socket Connected')).toBeInTheDocument();
  });

  test('cleans up on unmount', () => {
    const { unmount } = render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );

    unmount();

    expect(mockSocket.close).toHaveBeenCalled();
  });
});
