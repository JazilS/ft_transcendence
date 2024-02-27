import React from 'react';
import Image from 'next/image';
import '../styles.css';import "../../style/FadeMenu.css"


export default function HomePage() {
	return (
		<GameImage />
  );
}

const GameImage: React.FC = () => {
	return (
	<div className=" flex flex-col justify-center items-center rounded-3xl h-[90vh] ">
		<div>
			<Image
			src="/Pong.jpg" 
			alt="Pong" 
			width={565}
			height={353}
			className="rounded-3xl drop-shadow-2xl"/>
		</div>
	</div>
	);
}