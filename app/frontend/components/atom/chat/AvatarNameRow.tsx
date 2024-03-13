import { useGetProfileByIdMutation } from "@/app/store/features/User/user.api.slice";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import React, { useEffect, useState } from "react";
import PlayerAvatar from "../PlayerAvatar";

export default function AvatarNameRow({ userId }: { userId: string }) {
  const [user, setUser] = useState<PlayerProfile | undefined>();
  const [getAvatarUsernameById] = useGetProfileByIdMutation();

  useEffect(() => {
    async function fetchUser() {
      const response = await getAvatarUsernameById({ userId: userId });
      if ("data" in response) {
        console.log("response from getAvatarUsernameById = ", response);
        setUser(response.data);
      }
    }
    fetchUser();
  }, [getAvatarUsernameById, userId]);

  return (
    <div className="flex flex-row space-x-1 h-[100%] mr-2">
      <PlayerAvatar src={user?.imageSrc} width={30} height={30} />
      <span>{user?.name || "Unknown"}: </span>
    </div>
  );
}
