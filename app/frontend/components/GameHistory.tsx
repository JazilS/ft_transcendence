import React from 'react'
import Image from 'next/image';
import { UserProfile } from '@/models/ProfilePageModel'
import { press_Start_2P } from '@/models/FontModel';
import PlayerAvatar from './PlayerAvatar';
import '../app/styles.css'

interface GameHistoryProps {
	user: UserProfile;
}

const GameHistory: React.FC<GameHistoryProps> = ({ user }) =>{
	const gameList = user?.games ?? [];
	return (
		<div className='h-[700px] w-[800px] rounded-3xl m-7'>
			<ul>
				{gameList
				.slice(0)
				.reverse()
				.map((game) => (
				<li key={game.id}>
					<div className={`bg-white h-[100px] rounded-full text-black ${press_Start_2P} mb-10 flex flex-row p-5 items-center justify-between`}>
						<div className={`flex flex-row items-center`}>
							<div className={`rounded-full mr-3 bg-white h-[70px] w-[70px] justify-center items-center overflow-hidden`}>
								<Image src={user?.imageSrc} alt="profile picture" width={70} height={70}></Image>
							</div>
							{/* <PlayerAvatar src={user?.imageSrc} width={70} height={70}/> */}
							{user.name}
						</div>
						<div >
							{game.date?.toString()}
						</div>
					</div>
					{/* Autres détails de la partie */}
				</li>
				))}
			</ul>
		</div>
	);
};

export default GameHistory
