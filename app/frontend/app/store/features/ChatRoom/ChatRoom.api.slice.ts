import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { apiSlice } from "../../api/apiSlice";
import createChatRoomForm from "@/models/ChatRoom/CreateChatRoomForm";

export const ChatRoomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChatRoom: builder.mutation<ChatRoom, createChatRoomForm>({
      query: (data) => ({
        url: "/chat/createChatRoom",
        method: "POST",
        body: data,
      }),
    }),
    getPublicChatRooms: builder.mutation<ChatRoom[], void>({
      query: (data) => ({
        url: "/chat/getPublicChatRooms",
        method: "POST",
        body: data,
      }),
    }),
    getChatRoomsIn: builder.mutation<ChatRoom[], { userId: string }>({
      query: (data) => ({
        url: "/chat/getChatRoomsIn",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateChatRoomMutation,
  useGetPublicChatRoomsMutation,
  useGetChatRoomsInMutation,
} = ChatRoomApiSlice;
