import Image from "next/image";

interface PlayerAvatarProps {
	src: string;
	width: number;
	height: number;
  }
  

export default function PlayerAvatar({src, width, height} : PlayerAvatarProps){
	return(
		<div className={`rounded-full bg-white h-${height} w-${width} overflow-hidden`}>
			<Image 
				src={src} 
				alt="profile picture" 
				width={width} 
				height={height}>
			</Image>
		</div>
	);
};
