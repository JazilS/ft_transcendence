import {
  PayloadAction,
  Slice,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { ChatRoomApiSlice } from "./ChatRoom.api.slice";
import Messages from "@/models/ChatRoom/messages";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
<<<<<<< HEAD
import RoomData from "@/models/ChatRoom/RoomData";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
=======
>>>>>>> origin/jazil

export interface ChatRoomslice {
  chatRooms: ChatRoom[];
  userProfiles: {
    userProfile: PlayerProfile;
    role: string;
    fadeMenuInfos: FadeMenuInfos;
  }[];
<<<<<<< HEAD
  roomOn: RoomData;
  roomOnId: string;
=======
>>>>>>> origin/jazil
}

const initialState: ChatRoomslice = {
  chatRooms: [],
  userProfiles: [
    {
<<<<<<< HEAD
      userProfile: { id: "", name: "", imageSrc: "" },
=======
      userProfile: { id: "", name: "", imageSrc: "", gameHistory: []},
>>>>>>> origin/jazil
      role: "",
      fadeMenuInfos: {
        isFriend: false,
        isConnected: false,
        isInvited: false,
        isBlocked: false,
        isMuted: false,
        isKicked: false,
        isBanned: false,
        role: "",
      },
    },
  ],
<<<<<<< HEAD
  roomOn: {
    roomInfos: { id: "", name: "Not in a channel", roomType: "" },
    users: [],
    messages: [],
    password: "",
  },
  roomOnId: "",
=======
>>>>>>> origin/jazil
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
    setUserProfiles: (
      state,
      action: PayloadAction<
        {
          userProfile: PlayerProfile;
          role: string;
          fadeMenuInfos: FadeMenuInfos;
        }[]
      >
    ) => {
      state.userProfiles = action.payload;
    },
    updateRole: (
      state,
      action: PayloadAction<{ targetId: string; role: string }>
    ) => {
      console.log("upadeRole action.payload", action.payload);
      state.userProfiles = state.userProfiles.map((user) =>
        user.userProfile.id === action.payload.targetId
          ? { ...user, role: action.payload.role }
          : user
      );
    },
    newMessage: (state, action: PayloadAction<Messages>) => {
      state.roomOn.messages = [...state.roomOn.messages, action.payload];
      // console.log("newMessage action.payload", action.payload);
      // if (Array.isArray(state.chatRooms)) {
      //   const newChatRooms: ChatRoom[] = state.chatRooms.map((chatRoom) => {
      //     if (chatRoom.id === action.payload.chatId) {
      //       chatRoom.messages = [...chatRoom.messages, action.payload];
      //     }
      //     return chatRoom;
      //   });
      //   state.chatRooms = newChatRooms;
      // } else console.error("state.chatRooms is not an array");
    },
    addChatroom: (state, action: PayloadAction<ChatRoom>) => {
      console.log("addChatroom action.payload", action.payload);
      if (Array.isArray(state.chatRooms))
        state.chatRooms = [...state.chatRooms, action.payload];
      else console.error("state.chatRooms is not an array");
    },
    setUserProfiles: (state, action: PayloadAction<ChatMemberProfile[]>) => {
      state.roomOn.users = action.payload;
    },
    updateRole: (
      state,
      action: PayloadAction<{ targetId: string; role: string }>
    ) => {
      console.log("upadeRole action.payload", action.payload);
      state.userProfiles = state.userProfiles.map((user) =>
        user.userProfile.id === action.payload.targetId
          ? { ...user, role: action.payload.role }
          : user
      );
    },
    setRoomOn: (state, action: PayloadAction<RoomData>) => {
      console.log("setRoomOn action.payload", action.payload);
      state.roomOn = action.payload;
    },
    setRoomOnId: (state, action: PayloadAction<string>) => {
      state.roomOnId = action.payload;
    },
    updateUsers: (state, action: PayloadAction<ChatMemberProfile[]>) => {
      state.roomOn.users = action.payload;
    }
  },
});

export const {
  addRoom,
  newMessage,
  addChatroom,
  setUserProfiles,
  updateRole,
  setRoomOn,
  setRoomOnId,
  updateUsers,
} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
