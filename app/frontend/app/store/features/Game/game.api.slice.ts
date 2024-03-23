import { apiSlice } from "../../api/apiSlice";

export const GameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ data: String; status: number }, void>({
      query: (data) => ({
        url: "/auth/login",
        method: "GET",
        body: data,
      }),
    }),
      }),
  });

export const { useLoginMutation } =
  GameApiSlice;
