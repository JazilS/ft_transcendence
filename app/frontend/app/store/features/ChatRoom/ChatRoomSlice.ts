import {
  PayloadAction,
  Slice,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { ChatRoomApiSlice } from "./ChatRoom.api.slice";

export interface ChatRoomslice {
  chatRooms: ChatRoom[];
}

const initialState: ChatRoomslice = {
  chatRooms: [],
};

export const ChatRoomSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<ChatRoom>) => {
      console.log("addRoom action.payload", action.payload);
      if (Array.isArray(state.chatRooms))
        state.chatRooms = [...state.chatRooms, action.payload];
      else console.error("state.chatRooms is not an array");
    },

  },
});

export const { addRoom } = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
