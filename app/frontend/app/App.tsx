
import React, { Children } from "react";
import MyButton from '../components/Button';
import MyHeader from '../components/Header';
import { Press_Start_2P } from 'next/font/google'
import Home from "./page";
 
const press_Start_2P = Press_Start_2P({
	subsets: ['latin'],
	weight: '400'
  })

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-evenly">
			<div className={` text-black text-7xl ${press_Start_2P.className}`}>PONG</div>
			<MyButton>Login avec 42</MyButton>
		</div>
	);
}


const HomePageLayout: React.FC = () => {
	return (
		<div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
			<MyHeader></MyHeader>
			<div className="h-[100%] flex pb-20 justify-evenly">
				<HomePage></HomePage>
			</div>
		</div>
	);
};

export default HomePageLayout;