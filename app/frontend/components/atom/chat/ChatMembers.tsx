import { useEffect, useState } from "react";
import FadeMenu from "../../molecules/FadeMenu";
import { useGetUserNameByIdMutation } from "@/app/store/features/User/user.api.slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { useGetUserNamesFromRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";

export default function ChatMembers({ roomOnId }: { roomOnId: string }) {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [GetUserNamesFromRoom] = useGetUserNamesFromRoomMutation();

  useEffect(() => {
    const fetchUserNames = async () => {
      if (roomOnId === "") {
        setUserNames(["No members"]);
      } else
        try {
          const names:
            | { data: string[] }
            | { error: FetchBaseQueryError | SerializedError } =
            await GetUserNamesFromRoom({ channelId: roomOnId });
          if ("data" in names && !("error" in names)) {
            setUserNames(names.data);
          } else if ("error" in names) {
            console.error(
              "An error occurred while fetching user names:",
              names.error
            );
          }
        } catch (error) {
          console.error("An error occurred while fetching user names:", error);
        }
    };
    fetchUserNames();
  }, [GetUserNamesFromRoom, roomOnId]);

  // return
  return (
    <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
      <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%]">Chat Members</h1>
      <ul>
        {userNames.map((user, index) => (
          <li key={index}>
            <FadeMenu value={user} />{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}
