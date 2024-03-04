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
    getPublicChatRooms: builder.query<ChatRoom[], void>({
      query: (data) => ({
        url: "/chat/getPublicChatRooms",
        method: "GET",
        body: data,
      }),
    }),
  }),
});

export const { useCreateChatRoomMutation, useGetPublicChatRoomsQuery } = ChatRoomApiSlice;
