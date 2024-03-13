import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { apiSlice } from "../../api/apiSlice";
import createChatRoomForm from "@/models/ChatRoom/CreateChatRoomForm";
import Messages from "@/models/ChatRoom/messages";

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
    JoinChatRoom: builder.mutation<ChatRoom, { channelId: string; userId: string; password?: string }>({
      query: (data) => ({
        url: "/chat/joinChatRoom",
        method: "POST",
        body: data,
      }),
    }),
    setRoomOn: builder.mutation<ChatRoom, {userId: string, channelId: string}>({
      query: (data) => ({
        url: "/chat/setRoomOn",
        method: "POST",
        body: data,
      }),
    }),
    getChatRoomById: builder.mutation<ChatRoom, { channelId: string }>({
      query: (data) => ({
        url: "/chat/getChatRoomById",
        method: "POST",
        body: data,
      }),
    }),
    getUserNamesFromRoom: builder.mutation<string[], { channelId: string }>({
      query: (data) => ({
        url: "/chat/getUserNamesFromRoom",
        method: "POST",
        body: data,
      }),
    }),
    // addMessage: builder.mutation<Messages, { message: {data:{id: string; content: string; chatId: string; emitter: string;}} }>({
      addMessage: builder.mutation<Messages, { message: { data: { id: string; content: string; chatId: string; emitter: string}} }>({
      query: (data) => ({
        url: "/chat/addMessage",
        method: "POST",
        body: data,
      }),
    }),
    getMessagesFromRoom: builder.mutation<Messages[], {roomId: string}>({
      query: (data) => ({
        url: "/chat/getMessagesFromRoom",
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
  useJoinChatRoomMutation,
  useSetRoomOnMutation,
  useGetChatRoomByIdMutation,
  useGetUserNamesFromRoomMutation,
  useAddMessageMutation,
  useGetMessagesFromRoomMutation,
} = ChatRoomApiSlice;
