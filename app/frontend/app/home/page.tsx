import React from 'react';
import Image from 'next/image';
import '../styles.css';import "../../style/FadeMenu.css"
import MyHeader from '@/components/organism/Header';


export default function HomePage() {
	return (
		<div>
			<MyHeader />
			<GameImage />
		</div>
	);
}

function GameImage() {
	return (
		<div className=" flex flex-col justify-center items-center rounded-3xl h-[90vh] ">
		<div>
			<Image
			src="/Pong.jpg" 
			alt="Pong" 
			layout="responsive"
			width={1200}
			height={658}
			className="rounded-3xl drop-shadow-2xl"/>
		</div>
	</div>
	);
}