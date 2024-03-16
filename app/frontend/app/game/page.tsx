"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import {Pong} from "./Pong";

export default function PongPage() {
  return (
    <Provider store={store}>
      <Pong />
    </Provider>
  );
}
