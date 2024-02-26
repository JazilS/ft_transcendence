// import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// const ADD_USER = 'ADD_USER';
// const EDIT_USER_NAME = 'EDIT_USER_NAME';
// const EDIT_USER_AVATAR = 'EDIT_USER_AVATAR';
// const SET_CURRENT_USER = 'SET_CURRENT_USER';
// const ADD_ROOM = 'ADD_ROOM';
// const ADD_ROOM_TO_USER = 'ADD_ROOM_TO_USER';
// const SET_OPPONENT_USER = 'SET_OPPONENT_USER';

// export interface GameHistory {
//   id: string | undefined;
// 	opponent: string | undefined;
// 	opponentImageSrc: string | undefined;
// 	scoreUser: number;
// 	scoreOpponent: number;
// }

// export interface User {
//   id: string;
//   name: string;
//   imageSrc: string;
//   isConnected: boolean;
//   games: GameHistory[];
//   isReadyLobby: boolean;
//   channels: ChatRoom[];
//   blockedList: number[];
//   // Ajoutez d'autres propriétés ici si nécessaire
// }

// export interface ChatRoom {
//   id: string | undefined;
//   name: string | undefined;
//   roomType: string | undefined;
//   users: string[];
//   messages: string[];
// }

// interface AddUserAction {
//   type: typeof ADD_USER;
//   payload: User;
// }

// export const addUser = (user: User): AddUserAction => ({
//   type: ADD_USER,
//   payload: user
// });

// interface EditUserNameAction {
//   type: typeof EDIT_USER_NAME;
//   payload: { id: string; name: string };
// }

// export const editUserName = (id: string, name: string): EditUserNameAction => ({
//   type: EDIT_USER_NAME,
//   payload: { id, name }
// });

// interface EditUserAvatarAction {
//   type: typeof EDIT_USER_AVATAR;
//   payload: { id: string; imageSrc: string };
// }

// export const editUserAvatar = (id: string, imageSrc: string): EditUserAvatarAction => ({
//   type: EDIT_USER_AVATAR,
//   payload: { id, imageSrc }
// });

// interface SetCurrentUserAction {
//   type: typeof SET_CURRENT_USER;
//   payload: string;
// }

// export const setCurrentUser = (id: string): SetCurrentUserAction => ({
//   type: SET_CURRENT_USER,
//   payload: id
// });

// interface SetOpponentUserAction {
//   type: typeof SET_OPPONENT_USER;
//   payload: string;
// }

// export const setOpponentUser = (id: string): SetOpponentUserAction => ({
//   type: SET_OPPONENT_USER,
//   payload: id
// });

// interface AddRoomAction {
//   type: typeof ADD_ROOM;
//   payload: ChatRoom;
// }

// export const AddRoom = (room: ChatRoom): AddRoomAction => ({
//   type: ADD_ROOM,
//   payload: room
// });

// interface AddRoomToUserAction {
//   type: typeof ADD_ROOM_TO_USER;
//   payload: ChatRoom;
// }

// export const AddRoomToUser = (room: ChatRoom): AddRoomToUserAction => ({
//   type: ADD_ROOM_TO_USER,
//   payload: room
// });

// interface UsersState {
//   users: User[];
//   rooms: ChatRoom[];
//   currentUserId: string | null;
//   opponentUserId: string | null;
// }

// const initialState: UsersState = {
//   users: [],
//   rooms: [],
//   currentUserId: null,
//   opponentUserId: null,
// };

// type UsersAction = AddUserAction | EditUserNameAction | SetCurrentUserAction |
//                     EditUserAvatarAction | AddRoomAction | AddRoomToUserAction |
//                     SetOpponentUserAction;

// export const usersReducer = (state = initialState, action: UsersAction): UsersState => {
//   switch (action.type) {
//     case ADD_USER:
//       return { ...state, users: [...state.users, action.payload] };
//     case EDIT_USER_NAME:
//       return {
//         ...state,
//         users: state.users.map(user =>
//           user.id === action.payload.id && typeof user.id === typeof action.payload.id
//             ? { ...user, name: action.payload.name }
//             : user
//         )
//       };
//       case EDIT_USER_AVATAR:
//         return {
//           ...state,
//           users: state.users.map((user) =>
//             user.id === action.payload.id ? { ...user, imageSrc: action.payload.imageSrc } : user
//           )
//       };
//       case SET_CURRENT_USER:
//         return { ...state, currentUserId: action.payload };
//       case SET_OPPONENT_USER:
//         return { ...state, opponentUserId: action.payload };
//       case ADD_ROOM:
//         return { ...state, rooms: [...state.rooms, action.payload]}
//       case ADD_ROOM_TO_USER:
//         return {  ...state,
//           users: state.users.map((user) =>
//             user.id === state.currentUserId
//               ? {...user, channels: [...(user.channels || []), action.payload]}
//               : user)}
//     default:
//       return state;
//   }
// };

// export const store = configureStore({
// 	reducer: usersReducer
// });

// export const useAppDispatch:()=>typeof store.dispatch=useDispatch;
// export const useAppSelector: TypedUseSelectorHook<UsersState> = useSelector;

import { UnknownAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./features/User/UserSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";
import { persistStore as persisStore } from "redux-persist";

const persistConfig = {
  keyPrefix: "redux-",
  key: "root",
  storage,
};

const reducers = combineReducers({
  // app: AppSlice.reducer,
  // sidebar: SidebarSlice.reducer,
  user: UserSlice.reducer,
  // chat: ChatSlice.reducer,
  // friends: FriendsSlice.reducer,
  // groups: GroupSlice.reducer,
  // pong: PongSlice.reducer,
  // [apiSlice.reducerPath]: apiSlice.reducer,
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

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware({
      // serializableCheck: false,
      // immutableCheck: false,
    // }).concat([apiSlice.middleware, crashMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistStore = persisStore(store);