"use client";

import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { UserProfile } from "@/models/ProfilePageModel";
import { press_Start_2P, quantico } from "@/models/FontModel";
import PlayerProfile from "@/components/molecules/PlayerProfile";
import GameHistory from "../../components/molecules/GameHistory";
import { RootState } from "@/app/store/store";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { Provider } from "react-redux";
import { setNewNickname } from "@/app/store/features/User/UserSlice";

export default function EditUsername() {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);

  const handleNameDisplay = (value: boolean) => {
    setIsEditing(value);
  };

  const handleUsernameChange = (value: string) => {
    dispatch(setNewNickname(value));
    // dispatch(editUserName(user?.id ?? 0, value));
  };

  return (
    <div className="w-[315px] truncate mt-5">
      {isEditing ? (
        <div
          className={`h-auto w-auto flex flex-row justify-center items-center space-y-5 `}
        >
          <TextField
            inputProps={{
              style: {
                textAlign: "center",
                ...quantico.style,
              },
            }}
            InputProps={{
              style: {
                borderRadius: "50px",
                background: "rgba(255, 255, 255, 0.3)",
                border: "none",
              },
            }}
            size="small"
            onChange={(event) => handleUsernameChange(event.target.value)}
            value={user ? user.name : "User"}
          />
          <div className="pb-5 pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={() => handleNameDisplay(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div
          className={`h-[28px] w-[310] flex flex-row justify-center items-center space-y-5 truncate`}
        >
          <div
            className={`w-[310] truncate text-center text-xl ${press_Start_2P.className}`}
          >
            {user?.name}
          </div>
          <div className="pb-5 pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={() => handleNameDisplay(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
