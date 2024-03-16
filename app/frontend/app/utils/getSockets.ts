import { Socket, io } from "socket.io-client";

export let mySocket: Socket;

export function connectSocket() {
  const userId = 0;
  mySocket = io("http://localhost:4000", {
    auth: {
      token: userId,
    },
    transports: ["websocket"],
  });

  return mySocket;
}

export function disconnectSocket() {
  if (mySocket) {
    mySocket.disconnect();
  }
}