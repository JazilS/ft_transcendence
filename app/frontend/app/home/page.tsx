import React from 'react';
import '../styles.css';
import MyHeader from '@/components/Header';
import Image from 'next/image';

export default function HomePage() {
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader /> 
			<GameImage />
		</div>
  );
}

const GameImage: React.FC = () => {
	return (
	<div className=" flex flex-col justify-center items-center rounded-3xl h-[90vh] ">
		<div>
			<Image
			src="/PongFig.png" 
			alt="PongFig" 
			width={1200}
			height={1200}
			className="rounded-3xl drop-shadow-2xl"/>
		</div>
	</div>
	);
}