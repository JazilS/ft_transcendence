"use client";

import React, { use, useEffect, useState } from "react";
import { quantico } from "@/models/Font/FontModel";
import ChoseChat from "@/components/molecules/chat/ChatBar";
import ChatMembers from "@/components/atom/chat/ChatMembers";
import ChatZone from "@/components/molecules/chat/ChatZone";
import "../styles.css";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import {
  useGetChatRoomByIdMutation,
  useGetChatRoomsInMutation,
} from "../store/features/ChatRoom/ChatRoom.api.slice";
import User from "@/models/User/UserModel";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ConnectSocket, mySocket } from "../utils/getSocket";
import {
  useGetConnectedUserQuery,
  useLeaveChatroomMutation,
} from "../store/features/User/user.api.slice";
import {
  getChatRoomsInLocal,
  leaveChatroom,
  newRoomWithFriend,
  setAllData,
} from "../store/features/User/UserSlice";
import { RootState } from "../store/store";
import RoomData from "@/models/ChatRoom/RoomData";
import {
  newMessage,
  setRoomOn,
  setRoomOnId,
  setUserProfiles,
  updateUsers,
} from "../store/features/ChatRoom/ChatRoomSlice";
import Messages from "@/models/ChatRoom/messages";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";

export default function ChatPage() {
  const [isChan, setIsChan] = useState<boolean>(true);
  const [getRoomById] = useGetChatRoomByIdMutation();
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state: RootState) => state.user.user);
  const roomOn: RoomData = useAppSelector(
    (state: RootState) => state.chatRooms.roomOn
  );
  const roomOnId: string = useAppSelector(
    (state: RootState) => state.chatRooms.roomOnId
  );
  const [getChannels] = useGetChatRoomsInMutation();
  const response = useGetConnectedUserQuery({});

  // fetch user
  useEffect(() => {
    if (!mySocket) ConnectSocket();
    let user: User;
    if (response.data) {
      user = response.data as User;
      console.log("user : ", user);
      dispatch(setAllData(user));
    }
  }, [response.data, dispatch]);

  useEffect(() => {
    async function FetchChannels() {
      const response = await getChannels({});
      if ("data" in response) {
        dispatch(getChatRoomsInLocal(response.data));
        response.data.map((channel: ChatRoom) => {
          mySocket.emit("JOIN_SOCKET_ROOM", {
            room: channel.id,
          });
        });
      } else {
        console.error("Error during API call for chat rooms:", response.error);
      }
    }
    FetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch room
  useEffect(() => {
    const fetchRoom = async () => {
      const response:
        | { data: { chatroom: RoomData } }
        | { error: FetchBaseQueryError | SerializedError } = await getRoomById({
        channelId: roomOnId,
      });
      if ("data" in response) {
        console.log("response fetching room : ", response.data);
        dispatch(setRoomOn(response.data.chatroom as RoomData));
      } else if ("error" in response) {
        console.error("Error fetching actual room:", response.error);
      }
    };

    if (roomOnId !== "") {
      fetchRoom();
      console.log("fetching roomOnId : ", roomOnId);
    } else {
      dispatch(
        setRoomOn({
          roomInfos: { id: "", name: "Not in a Room", roomType: "" },
          users: [],
          messages: [],
          password: "",
        })
      );
    }
  }, [dispatch, getChannels, getRoomById, roomOnId]);

  // listen on socket
  useEffect(() => {
    if (mySocket) {
      mySocket.on("LEAVE_ROOM", async (userId: string, leavingType: string) => {
        if (
          userId === user.playerProfile.id &&
          (leavingType === "KICKED" || leavingType === "BANNED")
        ) {
          dispatch(leaveChatroom(roomOnId));
          dispatch(setRoomOnId(""));
        }
      });
      mySocket.on("MESSAGE", async (data: Messages) => {
        console.log("Received message:", data);
        if (data.chatId === roomOnId) {
          dispatch(newMessage(data));
        }
      });
      mySocket.on("UPDATE_ROOM", async (newRoom: RoomData) => {
        try {
          if (roomOnId === newRoom.roomInfos.id) {
            dispatch(setRoomOnId(newRoom.roomInfos.id));
            // if (newRoom.roomInfos.id === roomOnId) {
            dispatch(setRoomOn(newRoom));
            // }
          }
        } catch (error) {
          console.error("Error during room update:", error);
        }
      });
      mySocket.on("MUTE_USER", async (roomId: string, mutedId: string) => {
        if (roomOnId === roomId) {
          const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
            (user: ChatMemberProfile) => {
              if (user.userProfile.id === mutedId) {
                return {
                  ...user,
                  fadeMenuInfos: {
                    ...user.fadeMenuInfos,
                    isMuted: true,
                  },
                };
              } else {
                return user;
              }
            }
          );
          console.log("Updated Users after  MUTE ===", updatedUsers);
          dispatch(updateUsers(updatedUsers));
        }
      });
      mySocket.on("UNMUTE_USER", async (roomId: string, mutedId: string) => {
        if (roomOnId === roomId) {
          const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
            (user: ChatMemberProfile) => {
              if (user.userProfile.id === mutedId) {
                return {
                  ...user,
                  fadeMenuInfos: {
                    ...user.fadeMenuInfos,
                    isMuted: false,
                  },
                };
              } else {
                return user;
              }
            }
          );
          console.log("Updated Users after  UNMUTE ===", updatedUsers);
          dispatch(updateUsers(updatedUsers));
        }
      });
      if (roomOn != undefined) {
        mySocket.on(
          "JOIN_ROOM",
          async (data: ChatMemberProfile, roomId: string) => {
            if (roomOn.roomInfos.id === roomId)
              dispatch(setUserProfiles([...roomOn.users, data]));
          }
        );
        mySocket.on(
          "UPDATE_CHAT_MEMBERS",
          async (userId: string, roomId: string) => {
            if (roomOn.roomInfos.id === roomId) {
              const updatedProfiles: ChatMemberProfile[] = roomOn.users.filter(
                (user) => user.userProfile.id !== userId
              );
              dispatch(setUserProfiles(updatedProfiles));
            }
          }
        );
        mySocket.on(
          "PROMOTE_USER",
          async (targetId: string, roomId: string) => {
            console.log("PROMOTE_USER TargetId", targetId);
            if (roomOn.roomInfos.id === roomId) {
              const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
                (user: ChatMemberProfile) => {
                  if (user.userProfile.id === targetId) {
                    console.log("PROMOTE_USER", user);
                    return {
                      ...user,
                      role: "ADMIN",
                      fadeMenuInfos: {
                        ...user.fadeMenuInfos,
                        role: "ADMIN",
                      },
                    };
                  } else {
                    return user;
                  }
                }
              );
              dispatch(updateUsers(updatedUsers));
            }
          }
        );
        mySocket.on("SET_DM_CHATROOM", (roomId) => {
          console.log("SET_DM_CHATROOM IN LISTEN", roomId);
          dispatch(setRoomOnId(roomId));
        });
        mySocket.on(
          "CREATE_DM_CHATROOM",
          (friendId: string, roomId: string) => {
            console.log("CREATE_DM_CHATROOM IN LISTEN", friendId, roomId);
            dispatch(newRoomWithFriend({friendId, roomId}));
          }
        );
      }
    }

    return () => {
      mySocket.off("LEAVE_ROOM");
      mySocket.off("UPDATE_CHAT_MEMBERS");
      mySocket.off("UPDATE_ROOM");
      mySocket.off("MESSAGE");
      mySocket.off("JOIN_ROOM");
      mySocket.off("MUTE_USER");
      mySocket.off("UNMUTE_USER");
      mySocket.off("PROMOTE_USER");
      mySocket.off("SET_DM_CHATROOM");
      mySocket.off("CREATE_DM_CHATROOM");
    };
  }, [dispatch, roomOn, roomOn.users, roomOnId, user.playerProfile.id]);

  return (
    <div className="h-full">
      <div className="flex justify-center h-[95%] ">
        <div
          className={`flex flex-row h-full w-5/6 bg-gradient-to-tr from-black to-[#314287] rounded-3xl p-2 ${quantico.className}`}
        >
          <ChoseChat isChan={isChan} setIsChan={setIsChan} />
          <ChatZone />
          <ChatMembers />
        </div>
      </div>
    </div>
  );
}
