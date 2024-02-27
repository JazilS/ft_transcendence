import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "@/models/User/UserModel";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";

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
    access_toekn: "",
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
    setAccessToekn: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.access_toekn = action.payload;
    },
    setAllData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const {
  setNewAvatarSrc,
  setNewNickname,
  setAllData,
  joinChannel,
  setAccessToekn,
} = UserSlice.actions;
export default UserSlice.reducer;
