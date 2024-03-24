import { StartGameInfo } from "../../../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AppState {
  inQueue: boolean;
  waitingReady: boolean;
  gameData: StartGameInfo | undefined;
  users: any[];
}

const initialState: AppState = {
  inQueue: false,
  waitingReady: false,
  gameData: undefined,
  users: [],
};

export const GameSlice = createSlice({
  name: "app",
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
} = GameSlice.actions;
