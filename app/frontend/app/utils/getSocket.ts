import { Socket, io } from "socket.io-client";
import { useAppSelector } from "../store/hooks";
import { RootState, store } from "../store/store";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { decode } from "punycode";
import { DeckRounded } from "@mui/icons-material";

export let mySocket: Socket;

export function connectSocket() {
  // const state: RootState = store.getState();
  // const userId: string = state.user.user.playerProfile.id;
  // console.log(
  //   "Connecting socket with user ID:",
  // );
  let decoded;
  const accessToken = Cookies.get("accessToken");
  if (accessToken != undefined) {
    decoded = jwtDecode(accessToken);
    console.log(decoded);
  }

  mySocket = io("http://localhost:4000", {
    auth: {
      token: decoded?.sub,
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
