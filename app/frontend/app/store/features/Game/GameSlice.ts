import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Lobby, Game } from "@/models/Game/GameModel";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";

export interface GameSlice {
  lobby: Lobby;
  game: Game | undefined;
}

const initialState: GameSlice = {
  lobby: {
    id: undefined,
    user: undefined,
    opponent: {
      id: "Temp_Kojiro",
      name: "Kojiro",
      imageSrc: "/Kojiro.jpg",
    },
    status: true,
  },
  game: undefined,
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
