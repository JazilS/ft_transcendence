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

export default function ChatMembers({
  roomOn,
  role,
  setUserRole,
}: {
  roomOn: ChatRoom;
  role: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [UserProfiles, setUserProfiles] = useState<
    { userProfile: PlayerProfile; role: string }[]
  >([]);
  const [GetProfilesFromRoom] = useGetProfilesFromRoomMutation();
  const userId: string = useAppSelector(
    (state) => state.user.user.playerProfile.id
  );

  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (roomOn.id === "") {
        setUserProfiles([]);
      } else
        try {
          const profiles:
            | { data: { userProfile: PlayerProfile; role: string }[] }
            | { error: FetchBaseQueryError | SerializedError } =
            await GetProfilesFromRoom({ channelId: roomOn.id });
          if ("data" in profiles && !("error" in profiles)) {
            setUserProfiles(profiles.data);
          } else if ("error" in profiles) {
            console.error(
              "An error occurred while fetching user profiles:",
              profiles.error
            );
          }
        } catch (error) {
          console.error(
            "An error occurred while fetching user profiles:",
            error
          );
        }
    };
    fetchUserProfiles();
  }, [GetProfilesFromRoom, roomOn.id]);

  // listen for new members
  useEffect(() => {
    if (mySocket) {
      mySocket.on(
        "JOIN_ROOM",
        async (data: { userProfile: PlayerProfile; role: string }) => {
          console.log("NEW MEMBER : ", data.userProfile);
          console.log("ROLE : ", data.role);
          setUserProfiles([...UserProfiles, data]);
        }
      );
    }
    return () => {
      mySocket.off("JOIN_ROOM");
    };
  });

  // TODO: il faut reactiver ce code quand chaque utilisateur aura un nom unique
  // useEffect(() => {
  //   if (mySocket) {
  //     mySocket.on("LEAVE_ROOM", async (userName: string) => {
  //       console.log("LEAVE MEMBER : ", userName);
  //       setUserProfiles((UserProfiles) =>
  //         UserProfiles.filter((name) => name !== userName)
  //       );
  //     });
  //   }
  //   return () => {
  //     mySocket.off("LEAVE_ROOM");
  //   };
  // });

  // return
  return (
    <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
      <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%] ">Chat Members</h1>
      <div className={"h-[90%] w-full scrollbar-hide_3"}>
        <ul>
          {UserProfiles.map(
            (user: { userProfile: PlayerProfile; role: string }, index) => (
              <li key={index}>
                {user.userProfile.id !== userId ? (
                  <FadeMenu
                    targetName={user.userProfile.name as string}
                    targetId={user.userProfile.id}
                    active={true}
                    targetRole={user.role}
                    userRole={role}
                    setUserRole={setUserRole}
                    roomOn={roomOn}
                  />
                ) : (
                  <FadeMenu
                    targetName={user.userProfile.name as string}
                    targetId={user.userProfile.id}
                    active={false}
                    targetRole={user.role}
                    userRole={role}
                    setUserRole={setUserRole}
                    roomOn={roomOn}
                  />
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
