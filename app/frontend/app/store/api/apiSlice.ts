import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "../store";
// import cookie from 'cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = Cookies.get("accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    // const token = (getState() as RootState).user.user.access_token;
    // if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  reducerPath: "",
  endpoints: () => ({}),
});
