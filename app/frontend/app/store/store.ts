import {
  UnknownAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { persistStore as persisStore } from "redux-persist";
import { UserSlice } from "./features/User/UserSlice";
import { GameSlice } from "./features/Game/GameSlice";
import { ChatRoomSlice } from "./features/ChatRoom/ChatRoomSlice";
import { apiSlice } from "./api/apiSlice";
import crashMiddleware from "./middleware/crashMiddleware";

// const persistConfig = {
//   keyPrefix: "redux-",
//   key: "root",
//   storage,
// };
// const composeEnhancers =
//   (typeof window !== "undefined" &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose;

const reducers = combineReducers({
  user: UserSlice.reducer,
  chatRooms: ChatRoomSlice.reducer,
  game: GameSlice.reducer,
  // app: AppSlice.reducer,
  // sidebar: SidebarSlice.reducer,
  // friends: FriendsSlice.reducer,
  // groups: GroupSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const rootReducer = (
  state: ReturnType<typeof reducers> | undefined,
  action: UnknownAction
) => {
  // if (action.type === LOGOUT) {
  //   storage.removeItem("redux-root");
  //   return reducers(undefined, { type: undefined });
  // }

  return reducers(state, action);
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([apiSlice.middleware, crashMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistStore = persisStore(store);
