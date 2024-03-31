import User from "@/models/User/UserModel";
import { apiSlice } from "../../api/apiSlice";
import { get } from "http";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { leaveChatroom } from "./UserSlice";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { UserProfile } from "@/models/ProfilePageModel";

export const UserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUsername: builder.mutation<
      string,
      { userId: string; newName: string }
    >({
      query: (data) => ({
        url: "/user/updateUsername",
        method: "POST",
        body: data,
      }),
    }),
    updateAvatar: builder.mutation<
      string,
      { userId: string; newAvatar: string }
    >({
      query: (data) => ({
        url: "/user/updateAvatar",
        method: "POST",
        body: data,
      }),
    }),
    getUserNameById: builder.mutation<string, { userId: string }>({
      query: (data) => ({
        url: "/user/getUserNameById",
        method: "POST",
        body: data,
      }),
    }),
    getProfileById: builder.mutation<UserProfile, { userId: string }>({
      query: (data) => ({
        url: "/user/getProfileById",
        method: "POST",
        body: data,
      }),
    }),
    getProfileByName: builder.mutation<UserProfile, { userName: string }>({
      query: (data) => ({
        url: "/user/getProfileByName",
        method: "POST",
        body: data,
      }),
    }),
    getUserIdByName: builder.mutation<{ userId: string }, { userName: string }>(
      {
        query: (data) => ({
          url: "/user/getUserIdByName",
          method: "POST",
          body: data,
        }),
      }
    ),
    leaveChatroom: builder.mutation<void, { userId: string; roomId: string }>({
      query: (data) => ({
        url: "/user/leaveChatroom",
        method: "POST",
        body: data,
      }),
    }),
    getFadeMenuInfos: builder.mutation<
      FadeMenuInfos,
      { userId: string; targetId: string; roomId: string }
    >({
      query: (data) => ({
        url: "/user/getFadeMenuInfos",
        method: "POST",
        body: data,
      }),
    }),
    getConnectedUser: builder.query<User, {}>({
      query: () => ({
        url: "/user/getConnectedUser",
        method: "GET",
      }),
    }),
    addFriend: builder.mutation<
      Promise<
        | {
            success: boolean;
            message: string;
            sucess?: undefined;
          }
        | {
            sucess: boolean;
            message: string;
            success?: undefined;
          }
      >,
      { friend: string }
    >({
      query: (data) => ({
        url: "/friends/add",
        method: "POST",
        body: data,
      }),
    }),
    RemoveFriend: builder.mutation<
      Promise<
        | {
            success: boolean;
            message: string;
            sucess?: undefined;
            data: string;
          }
        | {
            sucess: boolean;
            message: string;
            success?: undefined;
            data: string;
          }
      >,
      { friend: string }
    >({
      query: (data) => ({
        url: "/friends/remove",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateUsernameMutation,
  useUpdateAvatarMutation,
  useGetUserNameByIdMutation,
  useGetProfileByIdMutation,
  useLeaveChatroomMutation,
  useGetFadeMenuInfosMutation,
  useGetConnectedUserQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useGetUserIdByNameMutation,
  useGetProfileByNameMutation,
} = UserApiSlice;
