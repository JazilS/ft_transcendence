import { use, useEffect, useState } from "react";
import FadeMenu from "../../molecules/chat/FadeMenu/FadeMenu";
import { useGetUserNameByIdMutation } from "@/app/store/features/User/user.api.slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { useGetProfilesFromRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import { mySocket } from "@/app/utils/getSocket";
import "@/style/ChatMembers.css";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { setUserProfiles } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import Button from "../Button";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import RoomData from "@/models/ChatRoom/RoomData";
import { RootState } from "@/app/store/store";
import User from "@/models/User/UserModel";

export default function ChatMembers() {
  const roomOn: RoomData = useAppSelector((state) => state.chatRooms.roomOn);
  const user: User = useAppSelector((state: RootState) => state.user.user);

  const dispatch = useAppDispatch();

  // listen for new and leaving members
  // useEffect(() => {
  //   if (mySocket) {
  //     mySocket.on("JOIN_ROOM", async (data: ChatMemberProfile) => {
  //       console.log("JOINGIN ROOM USERS UPDATE :", [...roomOn.users, data]);
  //       dispatch(setUserProfiles([...roomOn.users, data]));
  //     });
  //     mySocket.on("UPDATE_CHAT_MEMBERS", async (userId: string) => {
  //       const updatedProfiles: ChatMemberProfile[] = roomOn.users.filter(
  //         (user) => user.userProfile.id !== userId
  //       );
  //       console.log("UPDATED PROFILES AFTER LEAVING:", updatedProfiles);
  //       dispatch(setUserProfiles(updatedProfiles));
  //     });
  //   }
  //   return () => {
  //     mySocket.off("JOIN_ROOM");
  //     mySocket.off("UPDATE_CHAT_MEMBERS");
  //   };
  // });

  return (
    <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
      <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%] ">Chat Members</h1>
      <div className={"h-[90%] w-full scrollbar-hide_3"}>
        <ul>
          {roomOn.users.map((user: ChatMemberProfile) => (
            <li key={user.userProfile.id}>
              <Button
                className="hover:bg-[#f28eff] pl-9 w-[100%]"
                variant={"chatMember"}
                size={"channel"}
                infos={user.fadeMenuInfos}
                id="fade-button"
                // aria-controls={open ? "fade-menu" : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? "true" : undefined}
                // onClick={(event: React.MouseEvent<HTMLElement>) => {
                  // if (user.userProfile.id !== userId) handleClick(event);
                // }}
              >
                {user.userProfile.name}
              </Button>
              {/* <FadeMenu
                targetProfile={user}
                userRole={role}
                setUserRole={setUserRole}
                setAnchorEl={setAnchorEl}
                anchorEl={anchorEl}
                open={open}
                roomOn={roomOn}
              /> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// export default function ChatMembers({
//   roomOn,
//   role,
//   setUserRole,
//   setRoomOnId,
// }: {
//   roomOn: ChatRoom;
//   role: string;
//   setUserRole: React.Dispatch<React.SetStateAction<string>>;
//   setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
// }) {
//   // hooks
//   const dispatch = useAppDispatch();
//   const [GetProfilesFromRoom] = useGetProfilesFromRoomMutation();

//   // to open Menu
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   // actual userId
//   const userId: string = useAppSelector(
//     (state) => state.user.user.playerProfile.id
//   );

//   // get ChatMemberProfiles from store
//   const ChatUsers: ChatMemberProfile[] = useAppSelector(
//     (state) => state.chatRooms.userProfiles
//   );

//   // handleClick pour ouvrir le menu
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     console.log("handleClick !");
//     setAnchorEl(event.currentTarget);
//   };

//   // get ChatMemberProfiles from API for the first render
//   useEffect(() => {
//     const fetchUserProfiles = async () => {
//       if (roomOn.id === "") {
//         dispatch(setUserProfiles([]));
//       } else
//         try {
//           const profiles:
//             | { data: ChatMemberProfile[] }
//             | { error: FetchBaseQueryError | SerializedError } =
//             await GetProfilesFromRoom({ channelId: roomOn.id, userId: userId });
//           if ("data" in profiles && !("error" in profiles)) {
//             // setUserProfiles(profiles.data);
//             console.log("profiles after fetch", profiles);
//             dispatch(setUserProfiles(profiles.data));
//           } else if ("error" in profiles) {
//             console.error(
//               "An error occurred while fetching user profiles:",
//               profiles.error
//             );
//           }
//         } catch (error) {
//           console.error(
//             "An error occurred while fetching user profiles:",
//             error
//           );
//         }
//     };
//     fetchUserProfiles();
//   }, [GetProfilesFromRoom, dispatch, roomOn.id, userId]);

//   // TODO check getProfilesFromRoom
//   // TODO check setUSerProfiles

//   // listen for new and leaving members
//   useEffect(() => {
//     if (mySocket) {
//       mySocket.on(
//         "JOIN_ROOM",
//         async (data: {
//           userProfile: PlayerProfile;
//           role: string;
//           fadeMenuInfos: FadeMenuInfos;
//         }) => {
//           dispatch(setUserProfiles([...ChatUsers, data]));
//         }
//       );
//       mySocket.on("UPDATE_CHAT_MEMBERS", async (userId: string) => {
//         const updatedProfiles: ChatMemberProfile[] = ChatUsers.filter(
//           (user) => user.userProfile.id !== userId
//         );
//         dispatch(setUserProfiles(updatedProfiles));
//       });
//     }
//     return () => {
//       mySocket.off("JOIN_ROOM");
//       mySocket.off("UPDATE_CHAT_MEMBERS");
//     };
//   });

//   useEffect(() => {
//     if (mySocket) {
//       mySocket.on("MUTE_USER", (mutedUserId: string, muteTimeLeft: number) => {
//         const updatedProfiles: ChatMemberProfile[] = ChatUsers.map((user) =>
//           user.userProfile.id === mutedUserId
//             ? {
//                 ...user,
//                 fadeMenuInfos: { ...user.fadeMenuInfos, isMuted: true },
//               }
//             : user
//         );
//         dispatch(setUserProfiles(updatedProfiles));
//       });
//     }
//   }, [dispatch, ChatUsers]);

//   // print updated userProfiles
//   useEffect(() => {
//     console.log("userProfiles updated", ChatUsers);
//   }, [ChatUsers]);

//   const handleClickv2 = (event: React.MouseEvent<HTMLElement>) => {
//     // setAnchorEl(event.currentTarget);
//   };

//   return (
//     <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
//       <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%] ">Chat Members</h1>
//       <div className={"h-[90%] w-full scrollbar-hide_3"}>
//         <ul>
//           {ChatUsers.map((user: ChatMemberProfile) => (
//             <li key={user.userProfile.id}>
//               <Button
//                 className="hover:bg-[#f28eff] pl-9 w-[100%]"
//                 variant={"chatMember"}
//                 size={"channel"}
//                 infos={user.fadeMenuInfos}
//                 id="fade-button"
//                 aria-controls={open ? "fade-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? "true" : undefined}
//                 onClick={(event: React.MouseEvent<HTMLElement>) => {
//                   if (user.userProfile.id !== userId) handleClick(event);
//                 }}
//               >
//                 {user.userProfile.name}_{user.userProfile.id.slice(0, 3)}
//               </Button>
//               <FadeMenu
//                 targetProfile={user}
//                 userRole={role}
//                 setUserRole={setUserRole}
//                 setAnchorEl={setAnchorEl}
//                 anchorEl={anchorEl}
//                 open={open}
//                 roomOn={roomOn}
//               />
//               <button
//                 onClick={() => alert(userId + ">>>" + user.userProfile.id)}
//               >
//                 test
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
