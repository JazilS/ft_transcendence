"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Pong } from "./Pong";
import { useAppSelector } from "../store/hooks";

export default function PongPage() {

  return (
    <Provider store={store}>
      <Pong />
    </Provider>
  );
}
