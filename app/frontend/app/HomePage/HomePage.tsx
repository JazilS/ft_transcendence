import React from 'react';
import '../styles.css';
import MyHeader from '@/components/Header';
import GameImage from '@/components/GameImage';

export default function HomePage() {
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader /> 
			<GameImage />
		</div>
  );
}

