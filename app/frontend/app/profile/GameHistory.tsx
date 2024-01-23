import React, { useState, useEffect } from 'react'
import { UserProfile } from './ProfilePage';
import '../styles.css'

// interface UserProfile {
// 	name: string;
// 	imageSrc: string;
// 	games: {
// 		id: string;
// 		date: string;
// 		// Autres détails de la partie
// 	  }[];
// }

interface BodyProps {
	user: UserProfile;
  }

const GameHistory = ({ user }: BodyProps ) => {
	const gameList = user?.games ?? [];
	return (
	  <div className='h-[700px] w-[800px] rounded-3xl m-7'>
		<ul>
		  {gameList.map((game: { id: React.Key | null | undefined; }) => (
			<li key={game.id}>
			  <div className='bg-white h-[100px] rounded-full text-black mb-10'>{game.id?.toString()}</div>
			  {/* Autres détails de la partie */}
			</li>
		  ))}
		</ul>
	  </div>
	);
  };

export default GameHistory




// const GameHistory: React.FC<ProfileProps> = ({ user }) => {
// 	const gameList = user.games ?? [];
// 	return (
// 		<div className='bg-black h-[700px] w-[818px] rounded-3xl m-4'>
// 			<ul>
// 			{gameList.map((game) => (
// 				<li key={user.game.id}>
// 			<div className='bg-white h-[50px] text-white'>okok</div>
// 				{/* Autres détails de la partie */}
// 				</li>
// 			))}
// 			</ul>
// 		</div>
// 	);
// };

