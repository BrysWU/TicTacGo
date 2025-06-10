import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

// Your deployed backend URL:
const SOCKET_URL = "https://ttgback.onrender.com";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const socket = useMemo(() => io(SOCKET_URL), []);
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}