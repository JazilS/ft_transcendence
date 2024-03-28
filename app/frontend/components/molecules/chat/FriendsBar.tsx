"use client";

import { useState, useEffect } from "react";
import Button from "../../atom/Button";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { RootState } from "@/app/store/store";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Id } from "@reduxjs/toolkit/dist/tsHelpers";
import { setRoomOnId } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { mySocket } from "@/app/utils/getSocket";
// import '../style/FriendsBar.css'

export interface Friends {
  name: string;
  members: string[];
}

export default function Friendsbar() {
  const friends: { id: string; name: string; roomId: string }[] =
    useAppSelector((state: RootState) => state.user.user.friends);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("friends changed :", friends);
  }, [friends]);

  return (
    <div
      className={`h-[95%] w-full  rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}
    >
      <div
        className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#6265A9]`}
      >
        <div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
        </div>
        <div className="w-full">
          <ul>
            {friends.map(
              (friend: { id: string; name: string; roomId: string }) => (
                <li key={friend.id}>
                  <Button
                    className="hover:text-2xl text-white hover:bg-[#767ac9] active:bg-[#858ae6] "
                    variant={"publicChannel"}
                    size={"channel"}
                    onClick={() => {
                      console.log("friend clicked :", friend);
                      mySocket.emit("SET_DM_CHATROOM", {
                        friendId: friend.id,
                        friendName: friend.name,
                        roomId: friend.roomId,
                      });
                      // dispatch(setRoomOnId(friend.id));
                    }}
                  >
                    <h1 className="pl-8">{friend.name}</h1>
                  </Button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
