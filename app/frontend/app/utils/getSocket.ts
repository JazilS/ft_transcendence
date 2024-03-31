import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export let mySocket: Socket;

export function ConnectSocket() {
  if (mySocket) return ;
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

export function stopListeningToSocket(events: string[]) {
  events.map((event) => {
    if (mySocket.hasListeners(event)) mySocket.off(event);
  });
}
