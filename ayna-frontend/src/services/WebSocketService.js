import io from "socket.io-client";

// Set backendBaseUrl based on the environment
export const backendBaseUrl = "http://localhost:1337";

export const WebSocketService = (token) => {
  const socket = io(backendBaseUrl, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'], // Explicitly specify transport methods
  });

  // Debugging
  socket.on("connect", () => {
    console.log("WebSocket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  return socket;
};
