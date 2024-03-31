import { StartGameInfo } from "../../../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GameSlice {
  inQueue: boolean;
  waitingReady: boolean;
  gameData: StartGameInfo | undefined;
  users: any[];
  open: boolean;
  opponentId: string;
  message: string;
}

const initialState: GameSlice = {
  inQueue: false,
  waitingReady: false,
  gameData: undefined,
  users: [],
  open: false,
  message: "",
  opponentId: "",
};

export const GameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setInQueue: (state, action: PayloadAction<boolean>) => {
      state.inQueue = action.payload;
    },
    setWaitingReady: (state, action: PayloadAction<boolean>) => {
      state.waitingReady = action.payload;
    },
    setGameData: (state, action: PayloadAction<StartGameInfo | undefined>) => {
      state.gameData = action.payload;
    },
    setLeaderboardUser: (state, action) => {
      state.users = action.payload;
    },
    updateUserStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.users.forEach((user) => {
        if (ids.includes(user.id)) {
          user.status = status;
        }
      });
    },
    updateUserInfo: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (index >= 0) {
        if ("nickname" in action.payload) {
          state.users[index].nickname = action.payload.nickname;
          return;
        }
        state.users[index].profile.avatar = action.payload.avatar;
      }
    },
    addNewPlayerToLeaderboard: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (index < 0) state.users.push(action.payload);
    },
    openInvitation: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.opponentId = action.payload.data.id;
    },
    closeInvitation: (state) => {
      state.open = false;
      state.message = "";
      state.opponentId = "";
    },
  },
});

export const {
  setInQueue,
  setWaitingReady,
  setGameData,
  setLeaderboardUser,
  updateUserStatus,
  addNewPlayerToLeaderboard,
  updateUserInfo,
  closeInvitation,
  openInvitation,
} = GameSlice.actions;

export default GameSlice.reducer;
