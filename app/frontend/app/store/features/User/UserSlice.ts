import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { ChatRoom } from "../../store";

export interface GameHistory {
  id: string | undefined;
	opponent: string | undefined;
	opponentImageSrc: string | undefined;
	scoreUser: number;
	scoreOpponent: number;
}

export interface ChatRoom {
  id: string | undefined;
  name: string | undefined;
  roomType: string | undefined;
  users: string[];
  messages: string[];
}

export interface User {
  id: string | undefined;
  name: string | undefined;
  imageSrc: string | undefined;
  isConnected: boolean;
  games: GameHistory[];
  isReadyLobby: boolean;
  channels: ChatRoom[];
  blockedList: string[];
  // Ajoutez d'autres propriétés ici si nécessaire
}

export interface Userslice {
  user: User | undefined;
}

const initialState: Userslice = {
  user: {
    id: undefined,
    name: undefined,
    imageSrc: undefined,
    isConnected: false,
    games: [],
    isReadyLobby: false,
    channels: [],
    blockedList: [],
  },
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNewAvatarSrc: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.imageSrc = action.payload;
    },
    setNewNickname: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.name = action.payload;
    },
  },
});

export const { setNewAvatarSrc, setNewNickname } = UserSlice.actions;
export default UserSlice.reducer;
