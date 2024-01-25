'use client'

import React, { useState, useEffect } from 'react'
import MyHeader from '@/components/Header'
import GameHistory from '../../components/GameHistory'
import PlayerProfile from '@/components/PlayerProfile';
import { UserProfile } from '@/models/ProfilePageModel'
import '../styles.css'
import EditProfileButton from './EditProfile';
import CropDemo from '@/components/CropImage';

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile>();

    useEffect(() => {

        // get username and profile picture from back 
        setUser({
            name: "Musashi",
            imageSrc: "/Musashi.jpg",
            isConnected: true,
            games: [
                {id: "game1", date: "01/01/0001", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 10},
                {id: "game2", date: "02/02/0002", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 8, scoreOpponent: 11},
                {id: "game3", date: "03/03/0003", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 2},
                {id: "game4", date: "04/04/0004", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 0},
                {id: "game5", date: "05/05/0005", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 7, scoreOpponent: 11},
            ]});
    }, []);
    let color: string
    if (user?.isConnected === true )
        color = "bg-green-500"
    else
        color = "bg-red-500"
    return (
        <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
            <MyHeader />
            <div className='flex justify-center'>
                <div className="flex flex-row w-5/6 h-[789px] bg-white rounded-3xl p-7 space-x-7">
                    <div className={`h-[738px] w-[315px] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}>
                        <EditProfileButton />
                        <PlayerProfile user={user!} width={162} height={162}/>
                        <div className={`rounded-full h-3 w-3 ${color} blur-[2px]`}></div>
                    </div>
                    <div className='h-[738px] w-[855px] bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500'>
                            <GameHistory user={user!} />
                    </div>
                    <div className='h-[738px] w-[315px] bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'>
                    
                    </div>
                </div>
            </div>                        {/* <input onChange={(event) => setUser({ name: event.target.value, imageSrc: "/Musashi.jpg" })}/> */}
        </div>
  );
}