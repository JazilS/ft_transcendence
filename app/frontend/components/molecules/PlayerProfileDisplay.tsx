import { press_Start_2P } from "@/models/Font/FontModel";
import PlayerAvatar from "../atom/PlayerAvatar";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";

interface PlayerProfileProps {
  user: PlayerProfile | undefined;
  width: number;
  height: number;
  displayName: boolean;
}

const PlayerProfileDisplay: React.FC<PlayerProfileProps> = ({
  user,
  width,
  height,
  displayName,
}) => {
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
};

export default PlayerProfileDisplay;
