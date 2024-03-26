import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RootState, store } from "../store/store";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { decode } from "punycode";
import { DeckRounded } from "@mui/icons-material";
import { setUserProfile } from "../store/features/User/UserSlice";

export let mySocket: Socket;

export function ConnectSocket() {
  // const state: RootState = store.getState();
  // const userId: string = state.user.user.playerProfile.id;
  // console.log(
  //   "Connecting socket with user ID:",
  // );
  // let decoded;
  // const dispatch = useAppDispatch();
  // const accessToken = Cookies.get("accessToken");
  // if (accessToken != undefined) {
  //   decoded = jwtDecode(accessToken);
  //   dispatch(
  //     setUserProfile({
  //       id: decoded.id,
  //       name: decoded.sub as string,
  //       avatar: decoded.avatar,
  //     })
  //   );
  //   console.log(decoded);
  // }
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
