// socket.js

import io from "socket.io-client";

const URL = "http://localhost:4000";

const socket = io(URL, {
  autoConnect: false,
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 10, // Maximum number of reconnection attempts
  reconnectionDelay: 1000, // Time between each reconnection attempt (ms)
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.connect(); // Manually call connect to use the error handling

socket.on("connect", () => {
  console.log("Socket connected to server");
  console.log(socket.id);
});

export default socket;
