// import { PersonSlice } from "./features/personSlice";
// import { configureStore } from "@reduxjs/toolkit";
// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// export const store = configureStore({

// 	reducer:{
// 		person:PersonSlice.reducer
// 	},
// })

// export const useAppDispatch:()=>typeof store.dispatch=useDispatch;
// export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';


const ADD_USER = 'ADD_USER';
const EDIT_USER_NAME = 'EDIT_USER_NAME';
const SET_CURRENT_USER = 'SET_CURRENT_USER';

interface GameHistory {
	opponent: string;
	opponentImageSrc: string;
	scoreUser: number;
	scoreOpponent: number;
}

interface User {
  id: number;
  name: string;
  imageSrc: string;
  isConnected: boolean;
  games: GameHistory[];
  // Ajoutez d'autres propriétés ici si nécessaire
}

interface AddUserAction {
  type: typeof ADD_USER;
  payload: User;
}

export const addUser = (user: User): AddUserAction => ({
  type: ADD_USER,
  payload: user
});

interface EditUserNameAction {
  type: typeof EDIT_USER_NAME;
  payload: { id: number; name: string };
}

export const editUserName = (id: number, name: string): EditUserNameAction => ({
  type: EDIT_USER_NAME,
  payload: { id, name }
});

interface SetCurrentUserAction {
  type: typeof SET_CURRENT_USER;
  payload: number;
}

export const setCurrentUser = (id: number): SetCurrentUserAction => ({
  type: SET_CURRENT_USER,
  payload: id
});

interface UsersState {
  users: User[];
  currentUserId: number | null;
}

const initialState: UsersState = {
  users: [],
  currentUserId: null
};

type UsersAction = AddUserAction | EditUserNameAction | SetCurrentUserAction;

export const usersReducer = (state = initialState, action: UsersAction): UsersState => {
  switch (action.type) {
    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };
    case EDIT_USER_NAME:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, name: action.payload.name } : user
        )
      };
    case SET_CURRENT_USER:
      return { ...state, currentUserId: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({
	reducer: usersReducer
});

export const useAppDispatch:()=>typeof store.dispatch=useDispatch;
export const useAppSelector: TypedUseSelectorHook<UsersState> = useSelector;