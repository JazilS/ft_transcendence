import User from "@/models/User/UserModel";
import { apiSlice } from "../../api/apiSlice";

export const UserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<User, void>({
      query: (data) => ({
        url: "/user/register",
        method: "GET",
        body: data,
      }),
    }),
    updateUsername: builder.mutation<string, {userId: string, newName: string}>({
      query: (data) => ({
        url: "/user/updateUsername",
        method: "POST",
        body: data,
      }),
    }),
    updateAvatar: builder.mutation<string, {userId: string, newAvatar: string}>({
      query: (data) => ({
        url: "/user/updateAvatar",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterMutation, useUpdateUsernameMutation, useUpdateAvatarMutation } =
  UserApiSlice;
