"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Games } from "./Games";
import { useAppSelector } from "../store/hooks";

export default function GamesPage() {

  return (
    <Provider store={store}>
      <Games />
    </Provider>
  );
}
