import { Socket, io } from "socket.io-client";
import { useAppSelector } from "../store/hooks";
import { RootState, store } from "../store/store";

export let mySocket: Socket;

export function connectSocket() {
  const state: RootState = store.getState();
  const userId: string = state.user.user.playerProfile.id;
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
