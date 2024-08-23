import io from "socket.io-client";

// Set backendBaseUrl based on the environment
export const backendBaseUrl = process.env.REACT_APP_API_URL || 'https://favorable-wisdom-9b8eb902e1.strapiapp.com';
// https://favorable-wisdom-9b8eb902e1.strapiapp.com

export const WebSocketService = (token) => {
  const socket = io(backendBaseUrl, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'], // Explicitly specify transport methods
  });

  // Debugging and connection status
  socket.on("connect", () => {
    console.log("WebSocket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error.message);
    // You could add retry logic here if needed
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error.message);
    // Handle specific error cases if needed
  });

  socket.on("disconnect", (reason) => {
    console.warn("WebSocket disconnected:", reason);
    if (reason === 'io server disconnect') {
      // The disconnection was initiated by the server, you might want to try reconnecting
      socket.connect();
    } else if (reason === 'io client disconnect') {
      // The disconnection was initiated by the client, handle as needed
    }
  });

  socket.on("reconnect_attempt", () => {
    console.log("Attempting to reconnect to WebSocket...");
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected to WebSocket after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_failed", () => {
    console.error("WebSocket reconnection failed");
    // You might want to navigate to an error page or show a message to the user
  });

  return socket;
};
