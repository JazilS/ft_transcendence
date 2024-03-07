import User from "@/models/User/UserModel";
import { apiSlice } from "../../api/apiSlice";
import { get } from "http";

export const UserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<User, void>({
      query: (data) => ({
        url: "/user/register",
        method: "GET",
        body: data,
      }),
    }),
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
  }),
});

export const {
  useRegisterMutation,
  useUpdateUsernameMutation,
  useUpdateAvatarMutation,
  useGetUserNameByIdMutation,
} = UserApiSlice;
