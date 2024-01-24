import Image from "next/image";

interface PlayerAvatarProps {
	src: string;
	width: number;
	height: number;
  }
  

const PlayerAvatar: React.FC<PlayerAvatarProps> =  ({src, width, height}) =>{
	return(
		<div className={`rounded-full mb-10 bg-white h-${height} w-${width} justify-center items-center overflow-hidden`}>
			<Image src={src} alt="profile picture" width={width} height={height}></Image>
		</div>
	);
};

export default PlayerAvatar