import {
  PayloadAction,
  Slice,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { ChatRoomApiSlice } from "./ChatRoom.api.slice";
import Messages from "@/models/ChatRoom/messages";

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
    newMessage: (state, action: PayloadAction<Messages>) => {
      console.log("newMessage action.payload", action.payload);
      if (Array.isArray(state.chatRooms)) {
        const newChatRooms: ChatRoom[] = state.chatRooms.map((chatRoom) => {
          if (chatRoom.id === action.payload.chatId) {
            chatRoom.messages = [...chatRoom.messages, action.payload];
          }
          return chatRoom;
        });
        state.chatRooms = newChatRooms;
      } else console.error("state.chatRooms is not an array");
    },
    addChatroom: (state, action: PayloadAction<ChatRoom>) => {
      console.log("addChatroom action.payload", action.payload);
      if (Array.isArray(state.chatRooms))
        state.chatRooms = [...state.chatRooms, action.payload];
      else console.error("state.chatRooms is not an array");
    },
  },
});

export const { addRoom, newMessage, addChatroom } = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
