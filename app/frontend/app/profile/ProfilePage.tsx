"use client";

import React, { useEffect, useState } from "react";
import PlayerProfile from "@/components/molecules/PlayerProfileDisplay";
import EditAvatar from "./EditAvatar";
import "../styles.css";
import EditUsername from "@/components/atom/EditUsername";
import User from "@/models/User/UserModel";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import { useGetConnectedUserQuery } from "../store/features/User/user.api.slice";
import { ConnectSocket, mySocket } from "../utils/getSocket";
import {
  addFriend,
  getChatRoomsInLocal,
  removeFriend,
  setAllData,
} from "../store/features/User/UserSlice";
import { useGetChatRoomsInMutation } from "../store/features/ChatRoom/ChatRoom.api.slice";
import { RootState } from "../store/store";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import Button from "@/components/atom/Button";
import PlayerAvatar from "@/components/atom/PlayerAvatar";
import PublicProfile from "@/components/atom/PublicProfile";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import RoomData from "@/models/ChatRoom/RoomData";
import {
  setRoomOnId,
  updateUsers,
} from "../store/features/ChatRoom/ChatRoomSlice";
import { View } from "lucide-react";
import ViewProfileFromFriendList from "@/components/atom/ViewProfileFromFriendList";

export default function ProfilePage() {
  const [blur, setBlur] = useState(false);
  const [targetName, setTargetName] = useState("");
  const dispatch = useAppDispatch();
  const [getChannels] = useGetChatRoomsInMutation();
  const roomOn: RoomData = useAppSelector(
    (state: RootState) => state.chatRooms.roomOn
  );
  const roomOnId: string = useAppSelector(
    (state: RootState) => state.chatRooms.roomOnId
  );
  const [open, setOpen] = useState<boolean>(false);
  const user: User = useAppSelector((state: RootState) => state.user.user);

  // fetch user
  const response = useGetConnectedUserQuery({});
  React.useEffect(() => {
    console.log("GETTING USER");
    if (!mySocket) ConnectSocket();
    let user: User;
    if (response.data) {
      user = response.data as User;
      console.log("user : ", user);
      dispatch(setAllData(user));
    }
  }, [dispatch, response.data]);

  // fetch chat rooms
  React.useEffect(() => {
    console.log("GETTING ROOOMS");
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

  // listen on add/remove friend
  // useEffect(() => {
    // mySocket.on("REMOVE_FRIEND", (removingFriendId: string, roomId: string) => {
    //   console.log("REMOVE_FRIEND", removingFriendId, roomId);
    //   const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
    //     (user: ChatMemberProfile) => {
    //       if (user.userProfile.id === removingFriendId) {
    //         return {
    //           ...user,
    //           fadeMenuInfos: {
    //             ...user.fadeMenuInfos,
    //             isFriend: false,
    //           },
    //         };
    //       } else {
    //         return user;
    //       }
    //     }
    //   );
    //   dispatch(updateUsers(updatedUsers));
    //   if (roomOnId === roomId) {
    //     console.log("i get into setroom to '' here ");
    //     dispatch(setRoomOnId(""));
    //   }
    //   dispatch(removeFriend(removingFriendId));
    // });
    // mySocket.on("ADD_FRIEND", (newFriendId: string, newFriendName: string) => {
    //   dispatch(addFriend({ id: newFriendId, name: newFriendName, roomId: "" }));
    //   console.log("ADDING FRIEND", newFriendId, newFriendName);
    //   const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
    //     (user: ChatMemberProfile) => {
    //       if (user.userProfile.id === newFriendId) {
    //         return {
    //           ...user,
    //           fadeMenuInfos: {
    //             ...user.fadeMenuInfos,
    //             isFriend: true,
    //           },
    //         };
    //       } else {
    //         return user;
    //       }
    //     }
    //   );
    //   dispatch(updateUsers(updatedUsers));
    // });

    // return () => {
      // mySocket.off("ADD_FRIEND");
      // mySocket.off("REMOVE_FRIEND");
    // };
  // });

  let color: string;
  if (user?.isConnected === true) color = "bg-green-500";
  else color = "bg-red-500";
  return (
    <div
      className={`flex flex-row space-x-10 justify-center items-center h-full w-[100%] ${
        blur ? "blur-xl" : "none"
      }`}
    >
      <div
        className={`flex flex-col items-center h-[80%] w-[35%] bg-gradient-to-b from-black/30 to-transparent p-10 rounded-3xl space-y-5`}
      >
        <h1 className={`${press_Start_2P.className} text-3xl mb-20`}>
          {" "}
          Profile
        </h1>
        <EditAvatar user={user!.playerProfile} setBlur={setBlur} />
        <PlayerProfile
          user={user!.playerProfile}
          width={250}
          height={250}
          displayName={false}
        />
        <EditUsername />
      </div>
      <div
        className={`flex flex-col h-[80%] w-[35%] bg-gradient-to-b from-black/30 to-transparent p-10 rounded-3xl space-y-5`}
      >
        <h1
          className={`${press_Start_2P.className} justify-center text-3xl mb-20`}
        >
          Friends
        </h1>
        {user.friends.length > 0 ? (
          <ul>
            {user?.friends.map((friend) => (
              <li key={friend.id}>
                <div className="flex flex-row space-x-10">
                  <div
                    className={` w-[80%] mt-5 bg-gradient-to-r from-white/20 to-transparent rounded-full ${quantico.className}`}
                  >
                    <p className=" ml-20 py-5 text-2xl"> {friend.name} </p>
                  </div>
                  <Button
                    className={`mt-8 p-1 justify-center items-center bg-black/40 rounded-3xl ${quantico.className}`}
                    onClick={() => {
                      setTargetName(friend.name);
                      setOpen(true);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
                <ViewProfileFromFriendList
                  user={user}
                  targetName={targetName}
                  open={open}
                  setOpen={setOpen}
                />
              </li>
            ))}
          </ul>
        ) : (
          <h1
            className={`${press_Start_2P.className} text-xl text-white text-center mb-20`}
          >
            You don&apos;t have any friends ...
          </h1>
        )}
      </div>
    </div>
  );
}

//   let color: string;
//   if (user?.isConnected === true) color = "bg-green-500";
//   else color = "bg-red-500";
//   return (
//     <div className={`flex justify-center h-[95%] ${blur ? "blur-xl" : "none"}`}>
//       <div className="flex flex-row w-5/6 h-full bg-white rounded-3xl p-7 space-x-7">
//         <div
//           className={`h-[100%] w-[20%] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}
//         >
//           <EditAvatar user={user!.playerProfile} setBlur={setBlur} />
//           <PlayerProfile
//             user={user!.playerProfile}
//             width={162}
//             height={162}
//             displayName={false}
//           />
//           <EditUsername />
//           <div className={`rounded-full h-3 w-3 ${color} blur-[2px]`} />
//         </div>
//         <div className="h-[100%] w-[60%] bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500 ">
//           <GameHistory user={user!.playerProfile} />
//         </div>
//         <div className="h-[100%] w-[20%] bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500" />
//       </div>
//     </div>
//   );
// }
