import User from "@/models/User/UserModel";
import { apiSlice } from "../../api/apiSlice";
import { get } from "http";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { leaveChatroom } from "./UserSlice";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";

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
    getProfileById: builder.mutation<PlayerProfile, { userId: string }>({
      query: (data) => ({
        url: "/user/getProfileById",
        method: "POST",
        body: data,
      }),
    }),
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
    // url: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f5c20fa75a6d24063ccbf4571c48ac0b0379caf31268a8018b0dc3a7076b9fac&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Flogin&response_type=code",
    auth: builder.query<JSON, {}>({
      query: (data) => ({
        url: `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`,
        method: "GET",
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
} = UserApiSlice;
