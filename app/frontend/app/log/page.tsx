'use client'

import { press_Start_2P, quantico } from '@/models/FontModel'
import Link from 'next/link'
import "../../style/page.css"
import MyHeader from '@/components/organism/Header'
import { setCurrentUser, addUser, useAppDispatch, useAppSelector, store } from '../store/store'
import { Provider } from 'react-redux';
import { COMPILER_INDEXES } from 'next/dist/shared/lib/constants'
import { useEffect } from 'react'

function LogPage() {
    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.users);
    const newUserId = users.length + 1;

    const handleNewUser = () => {

        dispatch(addUser({id: newUserId,
            name: 'Musashi',
            imageSrc: '/Musashi.jpg',
            isConnected: true,
            games: [
                {opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 10},
                {opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 8, scoreOpponent: 11},
                {opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 2},
                {opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 0},
                {opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 7, scoreOpponent: 11},
            ]
        }))
        // dispatch(addUser({
            
        // }))
        // dispatch(setCurrentUser(newUserId));
    }

    
    useEffect(() => {
        users.forEach(user => console.log(`ID: ${user.id}, Name: ${user.name}`));
      }, [users]);

    return (
        <div className="flex flex-col items-center justify-evenly">
            <MyHeader display={false} />
            <div className={` text-black text-7xl ${press_Start_2P.className}`}>PONG</div>
            <Link href="/home">
                <button className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}
                onClick={handleNewUser}>
                    Login with 42
                </button >
            </Link>
        </div>
    );
}

export default function LogPageLayout() {
    return (
        <Provider store = {store}>
            <div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
                <div  className="bg-black h-[8vh] flex items-center ">
                    <span className={`items-center bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent text-2xl pl-48 ${press_Start_2P.className}`}>
                        FT_TRANSCENDENCE
                    </span>
                </div>
                <div className="h-[100%] flex pb-20 justify-evenly">
                    <LogPage></LogPage>
                </div>
            </div>
        </Provider>
    );
};
