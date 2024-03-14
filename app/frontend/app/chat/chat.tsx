"use client";

import React, { useEffect, useState } from "react";
import { quantico } from "@/models/Font/FontModel";
import ChoseChat from "@/components/molecules/chat/ChatBar";
import ChatMembers from "@/components/atom/chat/ChatMembers";
import ChatZone from "@/components/molecules/chat/ChatZone";
import "../styles.css";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { useGetChatRoomByIdMutation } from "../store/features/ChatRoom/ChatRoom.api.slice";
import User from "@/models/User/UserModel";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";

export default function ChatPage() {
  const [isChan, setIsChan] = useState<boolean>(true);
  const [roomOnId, setRoomOnId] = useState<string>("");
  const [roomOn, setRoomOn] = useState<ChatRoom | undefined>(undefined);
  const [getRoomById] = useGetChatRoomByIdMutation();

  useEffect(() => {
    const fetchRoom = async () => {
      if (roomOnId === "") {
        setRoomOn(undefined);
        return;
      }
      const response:
        | { data: ChatRoom }
        | { error: FetchBaseQueryError | SerializedError } = await getRoomById({
        channelId: roomOnId,
      });
      if ("data" in response && !response.data.error) {
        const responseData = response.data;
        setRoomOn(responseData);
        console.log("room : ", response);
      } else if ("error" in response) {
        console.error("Error fetching actual room:", response.error);
      }
    };

    fetchRoom();
    console.log("roomOnId : ", roomOnId);
  }, [getRoomById, roomOnId]);

  return (
    <div className="h-full">
      <div className="flex justify-center h-[95%] ">
        <div
          className={`flex flex-row h-full w-5/6 bg-gradient-to-tr from-black to-[#314287] rounded-3xl p-2 ${quantico.className}`}
        >
          <ChoseChat
            isChan={isChan}
            setIsChan={setIsChan}
            setRoomOnId={setRoomOnId}
          />
          <ChatZone roomOn={roomOn} setRoomOnId={setRoomOnId} />
          <ChatMembers roomOnId={roomOnId} />
        </div>
      </div>
    </div>
  );
}
