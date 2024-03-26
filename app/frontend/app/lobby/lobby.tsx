"use client";

import { press_Start_2P } from "@/models/Font/FontModel";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import PlayerProfileDisplay from "@/components/molecules/PlayerProfileDisplay";
import { setUser } from "../store/features/Game/GameSlice";
import { Lobby } from "@/models/Game/GameModel";
import "../styles.css";
import { useEffect } from "react";

export default function LobbyPage() {
  const dispatch = useAppDispatch();
  const user: PlayerProfile = useAppSelector(
    (state) => state.user.user.playerProfile
  );
  useEffect(() => {
    dispatch(setUser(user));
  });
  
  const lobby: Lobby = useAppSelector((state) => state.game.lobby);
  console.log(lobby?.user);

  return (
    <div className="w-[100%] flex justify-center">
      <div className="w-[50%] flex flex-row items-center justify-center space-x-20 mt-12">
        <Player user={lobby?.user!} test={true} />
        <div className="flex items-center drop-shadow-2xl">
          <span
            className={`text-white text-8xl drop-shadow-2xl ${press_Start_2P.className.toString()}`}
          >
            VS
          </span>
        </div>
        <Player user={lobby?.opponent!} test={false} />
      </div>
    </div>
  );
}

function Player({ user, test }: { user: PlayerProfile; test: boolean }) {
  const defaultUser: PlayerProfile = {
    id: "000",
    name: "???",
    imageSrc: "/DefaultAvatar.png",
  };

  return (
    <div className="w-[90%] p-10 bg-white bg-opacity-5 rounded-3xl shadow-2xl items-center flex flex-col ">
      {test === true ? (
        <PlayerProfileDisplay
          user={user}
          width={220}
          height={220}
          displayName={true}
        />
      ) : (
        <PlayerProfileDisplay
          user={defaultUser}
          width={220}
          height={220}
          displayName={true}
        />
      )}
      <p
        className={`w-[90%] h-[15%] bg-white bg-opacity-40 rounded-lg flex justify-center items-center text-white test-xl text-nowrap ${press_Start_2P.className}`}
      >
        {test === true ? "READY" : "Waiting ..."}
      </p>
    </div>
  );
}
