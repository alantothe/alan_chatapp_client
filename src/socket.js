import { io } from "socket.io-client";

const URL = "http://localhost:4000";
const socket = io(URL, {
  autoConnect: false,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.connect(); // Manually call connect to use the error handling

export default socket;
