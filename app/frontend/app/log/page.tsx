"use client";

import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import Link from "next/link";
import "../../style/page.css";
import MyHeader from "@/components/organism/Header";
// import { setCurrentUser, addUser, useAppDispatch, useAppSelector, store, User, setOpponentUser } from '../store/store'
import { Provider } from "react-redux";
import { useEffect } from "react";
import { setAllData } from "../store/features/User/UserSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { store } from "../store/store";
// import { useAppDispatch, useAppSelector } from '../store/hooks'

function LogPage() {
  const dispatch = useAppDispatch();
  const newUserId = uuidv4();
  const OpponentUserId = uuidv4();

  const handleNewUser = () => {
    dispatch(
      setAllData({
        playerProfile: {
            id:newUserId,
            name: "Musashi",
            imageSrc: "/Musashi.jpg",
            gameHistory: [
                {
                  id: OpponentUserId,
                  opponent: "Kojiro",
                  opponentImageSrc: "/Kojiro.jpg",
                  scoreUser: 11,
                  scoreOpponent: 10,
                },
                {
                  id: OpponentUserId,
                  opponent: "Kojiro",
                  opponentImageSrc: "/Kojiro.jpg",
                  scoreUser: 8,
                  scoreOpponent: 11,
                },
                {
                  id: OpponentUserId,
                  opponent: "Kojiro",
                  opponentImageSrc: "/Kojiro.jpg",
                  scoreUser: 11,
                  scoreOpponent: 2,
                },
                {
                  id: OpponentUserId,
                  opponent: "Kojiro",
                  opponentImageSrc: "/Kojiro.jpg",
                  scoreUser: 11,
                  scoreOpponent: 0,
                },
                {
                  id: OpponentUserId,
                  opponent: "Kojiro",
                  opponentImageSrc: "/Kojiro.jpg",
                  scoreUser: 7,
                  scoreOpponent: 11,
                },
              ],
        },
        channelsIn: [],
        isConnected: true,
        isReadyLobby: true,
      })
    );
    // dispatch(setCurrentUser(newUserId));
    // dispatch(setOpponentUser(OpponentUserId));
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      {/* <MyHeader display={false} /> */}
      <div className={` text-black text-7xl ${press_Start_2P.className}`}>
        PONG
      </div>
      <Link href="/home">
        <button
          className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}
          onClick={handleNewUser}
        >
          Login with 42
        </button>
      </Link>
    </div>
  );
}

export default function LogPageLayout() {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
        <div className="bg-black h-[8vh] flex items-center ">
          <span
            className={`items-center bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent text-2xl pl-48 ${press_Start_2P.className}`}
          >
            FT_TRANSCENDENCE
          </span>
        </div>
        <div className="h-[100%] flex pb-20 justify-evenly">
          <LogPage></LogPage>
        </div>
      </div>
    </Provider>
  );
}
