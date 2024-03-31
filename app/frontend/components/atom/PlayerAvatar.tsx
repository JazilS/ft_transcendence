import Image from "next/image";

interface PlayerAvatarProps {
  src: string | undefined;
  width: number;
  height: number;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ src, width, height }) => {
  if (src === undefined || src === "") {
    src = "/DefaultAvatar.png";
  }
  return (
    <div
      className={`rounded-full bg-white h-${height} w-${width} overflow-hidden`}
    >
      <Image
        src={src ?? ""}
        alt="profile picture"
        width={width}
        height={height}
        // priority
      ></Image>
    </div>
  );
};

export default PlayerAvatar;
