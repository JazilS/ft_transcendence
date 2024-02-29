import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Lobby, Game } from "@/models/Game/GameModel";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { StartGameInfo } from "@/app/game/utils/types";

export interface GameSlice {
  gameData : StartGameInfo | undefined;
  inQueue: boolean;
  waitingQueue: boolean;
}

const initialState: GameSlice = {
    gameData: {
      room: "Game 1",
      creator: {
        nickname: "Joueur 1",
        avatar: "",
      },
      opponent: {
        nickname: "Joueur 2",
        avatar: "",
      },
    },
    inQueue: false,
    waitingQueue: false,
};

export const GameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      if (state.game) state.game = action.payload;
    },
    setUser: (state, action: PayloadAction<PlayerProfile>) => {
      if (state.lobby) state.lobby.user = action.payload;
    },
  },
});

export const { setGame, setUser } = GameSlice.actions;
export default GameSlice.reducer;
