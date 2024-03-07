"use client";

import { useEffect, useState } from "react";
import Button from "../../atom/Button";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import JoinChanModal from "./JoinChan";
import CreateChanModal from "./CreateChan";
import { useGetChatRoomsInMutation, useSetRoomOnMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
// import '../style/ChannelList.css'

export default function ChannelBar({setRoomOnId} : {setRoomOnId: React.Dispatch<React.SetStateAction<string>>}) {
  const channels = useAppSelector((state) => state.user.user.channelsIn);

    useEffect(() => {
      console.log("channelsIn : ", channels);
    })
  return (
    <div className={`h-[95%] w-full rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}>
      <div
        className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#9EB7F6]`}
      >
        <div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
          <CreateChanModal setRoomOnId={setRoomOnId}/>
          <JoinChanModal setRoomOnId={setRoomOnId}/>
        </div>
        <div className="w-full">
          {channels.length === 0 ? (
            <h1 className="text-center">No Channel Joined yet</h1>
          ) : (
            <ul>
              {channels!.map((channel: ChatRoom) => (
                <li key={channel.id}>
                  <Button
                    className="hover:bg-[#6E82B6] active:bg-[#596a94]"
                    variant={"publicChannel"}
                    size={"channel"}
                    onClick={() => {
                      setRoomOnId(channel.id);
                    }}
                  >
                    <h1 className="pl-8">{channel.name}</h1>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
