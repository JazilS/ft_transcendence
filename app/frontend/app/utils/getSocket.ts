import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export let mySocket: Socket;

export function ConnectSocket() {
  try {
    mySocket = io("http://localhost:4000", {
      auth: {
        token: `${Cookies.get("accessToken")}`,
      },
      transports: ["websocket"],
    });
  } catch (err) {
    console.log(err);
  }
  return mySocket;
}

export function disConnectSocket() {
  if (mySocket) {
    mySocket.disconnect();
  }
}
