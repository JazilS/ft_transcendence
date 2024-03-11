import { io, Socket } from "socket.io-client";

let socket: Socket;

const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
        auth: {
          token: userId, // Use the user ID as the authentication token
        },
      });
  }
};

export {connectSocket, socket}