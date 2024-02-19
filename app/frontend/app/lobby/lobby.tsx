'use client'

import PlayerProfile from '@/components/molecules/PlayerProfile'
import { press_Start_2P } from '@/models/FontModel'
import '../styles.css'
import { Provider } from 'react-redux'
import { store, useAppDispatch, useAppSelector, User } from '@/app/store/store'


export default function Lobby() {
	
	const user : User | undefined = useAppSelector(state => state.users.find(user => user.id === state.currentUserId));
	const opponent : User | undefined = useAppSelector(state => state.users.find(user => user.id === state.opponentUserId));
	
	return (
		<div className='w-[100%] flex justify-center'>
			<div className="w-[50%] flex flex-row items-center justify-center space-x-20 mt-12">
				<Player user={user!} test={true}/>
				<div className="flex items-center drop-shadow-2xl">
					<span className={`text-white text-8xl drop-shadow-2xl ${press_Start_2P.className.toString()}`}>
						VS
					</span>
				</div>
				<Player user={opponent!} test={false}/>	
			</div>
		</div>
	)
}


function Player({user, test}: {user: User; test : boolean}) {

	const defaultUser : User = {
	
		id: 0,
		name: '???',
		imageSrc: '/DefaultAvatar.png',
		isConnected: false,
		isReadyLobby: false,
		games: []
	
	}

	return (
			<div className="w-[90%] p-10 bg-white bg-opacity-5 rounded-3xl shadow-2xl items-center flex flex-col ">
				{ test === true ? (<PlayerProfile user={user} width={220} height={220} displayName={true}/> )
								: ( <PlayerProfile user={defaultUser} width={220} height={220} displayName={true}/>)}
					<p className={`w-[90%] h-[15%] bg-white bg-opacity-40 rounded-lg flex justify-center items-center text-white test-xl text-nowrap ${press_Start_2P.className}`}>
						{test === true ? 'READY' : 'Waiting ...'}
					</p>
			</div>
	);
}
