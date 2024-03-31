import { press_Start_2P } from "@/models/Font/FontModel";
import PlayerAvatar from "../atom/PlayerAvatar";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";

interface PlayerProfileProps {
  user: PlayerProfile | undefined;
  width: number;
  height: number;
  displayName: boolean;
}

export default function PlayerProfileDisplay({
  user,
  width,
  height,
  displayName,
}: PlayerProfileProps) {
  return (
    <>
      <PlayerAvatar src={user?.imageSrc} width={width} height={height} />
      {displayName ? (
        <div
          className={`w-full truncate text-center p-5 text-xl mt-10 ${press_Start_2P.className}`}
        >
          {user?.name}
        </div>
      ) : null}
    </>
  );
}
