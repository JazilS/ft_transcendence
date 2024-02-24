'use client'

import React, { useState } from 'react'
import PlayerProfile from '@/components/molecules/PlayerProfile';
import GameHistory from '../../components/molecules/GameHistory'
import EditAvatar from './EditAvatar';
import '../styles.css'
import EditUsername from '@/components/atom/EditUsername';
import { User, useAppDispatch, useAppSelector } from '../store/store';


export default function ProfilePage() {
	const [blur, setBlur] = useState(false)
	const dispatch = useAppDispatch();
	const user : User | undefined = useAppSelector(state => state.users.find(user => user.id === state.currentUserId));

	let color: string
	if (user?.isConnected === true )
		color = "bg-green-500"
	else
		color = "bg-red-500"
	return (
			<div className={`flex justify-center h-[85%] ${blur ? 'blur-xl' : 'none'}`}>
				<div className="flex flex-row w-5/6 h-full bg-white rounded-3xl p-7 space-x-7">
					<div className={`h-[100%] w-[20%] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}>
						<EditAvatar user={user!} setBlur={setBlur}/>
						<PlayerProfile user={user!} width={162} height={162} displayName={false} />
						<EditUsername/>
				<div className={`rounded-full h-3 w-3 ${color} blur-[2px]`} />
				</div>
					<div className='h-[100%] w-[60%] bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500 '>
						<GameHistory user={user!} />
					</div>
					<div className='h-[100%] w-[20%] bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'/>
				</div>
			</div>
  );
}



