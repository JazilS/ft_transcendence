import Image from "next/image";

interface PlayerAvatarProps {
	src: string | undefined;
	width: number;
	height: number;
  }
  

const PlayerAvatar: React.FC<PlayerAvatarProps> =  ({src, width, height}) =>{
	return(
		<div className={`rounded-full bg-white h-${height} w-${width} overflow-hidden`}>
			<Image 
				src={src!}
				alt="profile picture" 
				width={width} 
				height={height}>
			</Image>
		</div>
	);
};

export default PlayerAvatar