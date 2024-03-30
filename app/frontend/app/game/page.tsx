"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Pong } from "./Pong";
import { Games } from "./Games";

export default function PongPage() {
  return (
    <Provider store={store}>
      <Games />
    </Provider>
  );
}
