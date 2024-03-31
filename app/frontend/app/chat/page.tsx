"use client";

import React from "react";
import "../styles.css";
import { Provider } from "react-redux";
import ChatPage from "./chat";
import { store } from "../store/store";

export default function Page() {
  return (
    <Provider store={store}>
      <ChatPage />
    </Provider>
  );
}
