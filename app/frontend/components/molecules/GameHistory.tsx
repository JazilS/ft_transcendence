import React from "react";
import { UserProfile } from "@/models/ProfilePageModel";
import { press_Start_2P } from "@/models/FontModel";
import PlayerAvatar from "../atom/PlayerAvatar";
import "../../app/styles.css";
import { User } from "../../app/store/store";

export default function GameHistory({ user }: { user: User }) {
  const gameList = user?.games ?? [];
  return (
    <div className="h-[100%] w-[100%] rounded-3xl p-7 flex items-center">
      <ul className="flex flex-col w-[100%] space-y-5 justify-evenly">
        {gameList
          .slice(0)
          .reverse()
          .map((game) => (
            <li key={game.id}>
              <div
                className={`bg-white h-[20%] w-[100%] rounded-full text-black flex flex-row p-5 items-center justify-between `}
              >
                <div className="flex">
                  <PlayerAvatar src={user?.imageSrc} width={70} height={70} />
                </div>
                <p
                  className={`${press_Start_2P.className} w-[190px] justify-start pl-4 truncate`}
                >
                  {" "}
                  {user.name}{" "}
                </p>

                <div className={`text-3xl ${press_Start_2P.className}`}>
                  {game.scoreUser} VS {game.scoreOpponent}
                </div>
                <div
                  className={`${press_Start_2P.className} truncate text-right p-2 w-[190px]`}
                >
                  {" "}
                  {game.opponent?.toString()}
                </div>
                <div className="flex">
                  <PlayerAvatar
                    src={game.opponentImageSrc}
                    width={70}
                    height={70}
                  />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
