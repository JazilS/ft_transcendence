'use client'

import { press_Start_2P, quantico } from '@/models/FontModel'
import Link from 'next/link'
import "../../style/page.css"
import MyHeader from '@/components/organism/Header'
import { setCurrentUser, addUser, useAppDispatch, useAppSelector, store, User, setOpponentUser } from '../store/store'
import { Provider } from 'react-redux';
import { useEffect } from 'react'
import { v4 as uuidv4 } from "uuid";

function LogPage() {
    const dispatch = useAppDispatch();
    const users : User[] = useAppSelector(state => state.users);
    const newUserId = uuidv4();
    const newUserId2 = uuidv4();
    const OpponentUserId = uuidv4();

    const handleNewUser = () => {

        dispatch(addUser({
            id: newUserId,
            name: 'Musashi',
            imageSrc: '/Musashi.jpg',
            isConnected: true,
            isReadyLobby: true,
            games: [
                {id: 0, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 10,},
                {id: 1, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 8, scoreOpponent: 11,},
                {id: 2, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 2,},
                {id: 3, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 0,},
                {id: 4, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 7, scoreOpponent: 11,},
            ],
            channels: [],
            blockedList: []
        }))
        dispatch(addUser({
            id: newUserId2,
            name: 'Kojiro',
            imageSrc: '/Kojiro.jpg',
            isConnected: true,
            isReadyLobby: false,
            games: [
                {id: 0, opponent: "Musashi", opponentImageSrc: "/Musashi.jpg", scoreUser: 10, scoreOpponent: 11,},
                {id: 1, opponent: "Musashi", opponentImageSrc: "/Musashi.jpg", scoreUser: 11, scoreOpponent: 8,},
                {id: 2, opponent: "Musashi", opponentImageSrc: "/Musashi.jpg", scoreUser: 2, scoreOpponent: 11,},
                {id: 3, opponent: "Musashi", opponentImageSrc: "/Musashi.jpg", scoreUser: 0, scoreOpponent: 11,},
                {id: 4, opponent: "Musashi", opponentImageSrc: "/Musashi.jpg", scoreUser: 11, scoreOpponent: 7,},
            ],
            channels: [],
            blockedList: []
        }))
        dispatch(setCurrentUser(newUserId));
        dispatch(setOpponentUser(OpponentUserId));
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
