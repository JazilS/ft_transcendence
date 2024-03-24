import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "@/models/User/UserModel";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
// import {jwtDecode} from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export interface Userslice {
  user: User;
}

const initialState: Userslice = {
  user: {
    playerProfile: {
      id: "",
      name: undefined,
      imageSrc: undefined,
      gameHistory: undefined,
    },
    channelsIn: [],
    isConnected: false,
    isReadyLobby: false,
    access_token: "",
  },
};
export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNewAvatarSrc: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.playerProfile.imageSrc = action.payload;
    },
    setNewNickname: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.playerProfile.name = action.payload;
    },
    joinChannel: (state, action: PayloadAction<ChatRoom>) => {
      if (state.user)
        state.user.channelsIn = [...state.user.channelsIn, action.payload];
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.access_token = action.payload;
    },
    setAllData: (state, action: PayloadAction<User>) => {
      // const jwtToken = localStorage.getItem("userId");
      // const jwtToken = Cookies.get("userId");

      // if (jwtToken) {
      //   const userId: string = jwtDecode(jwtToken);
      //   console.log("userId from cookie = ", userId);
      // } else console.log("no userId found");
      state.user = action.payload;
    },
    getChatRoomsInLocal: (state, action: PayloadAction<ChatRoom[]>) => {
      if (state.user) state.user.channelsIn = action.payload;
    },
    leaveChatroom: (state, action: PayloadAction<string>) => {
      if (state.user)
        state.user.channelsIn = state.user.channelsIn.filter(
          (channel) => channel.id !== action.payload
        );
      console.log("leaveChatroom state.user.channelsIn", state.user.channelsIn);
    },
  },
});

export const {
  setNewAvatarSrc,
  setNewNickname,
  setAllData,
  joinChannel,
  setAccessToken,
  getChatRoomsInLocal,
  leaveChatroom,
} = UserSlice.actions;
export default UserSlice.reducer;
