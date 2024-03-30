"use client";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import Lobby from "./lobby";
import "../styles.css";

export default function LobbyPage() {
  return (
    <Provider store={store}>
      <Lobby />
    </Provider>
  );
}
