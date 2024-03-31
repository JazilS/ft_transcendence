import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import {
  useJoinBackCurrentGameMutation,
  useJoinQueueMutation,
  useLeaveQueueMutation,
} from "../store/features/Game/game.api.slice";
import {
  PongGameType,
  PongTypeNormal,
  PongTypeSpecial,
} from "@/shared/constant";
import { setGameData } from "../store/features/Game/GameSlice";
import { Button, Stack } from "@mui/material";
import WaitingQueue from "./WaitingQueue";
import { useRouter } from "next/navigation";
import { PongEvent } from "@/shared/socketEvent";
import { ConnectSocket, mySocket } from "../utils/getSocket";
import { ParsedUrlQuery } from "node:querystring";
import { StartGameInfo } from "@/shared/types";


export const Games = () => {
  const [open, setOpen] = useState<{ queue: boolean }>({ queue: false });
  const gameData = useAppSelector((state: RootState) => state.game.gameData);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [joinQueue, { isLoading }] = useJoinQueueMutation();
  const [joinBackGame, joinBackMutation] = useJoinBackCurrentGameMutation();

  useEffect(() => {
    ConnectSocket();
    mySocket.on(PongEvent.LETS_PLAY, (data: StartGameInfo) => {
      console.log("LET'S PLAY event received", data);
      dispatch(setGameData(data));
      router.push("/pong?myroom=" + data.data.room);
    });
    return () => {
      mySocket.off(PongEvent.LETS_PLAY);
    };
  }, [router, dispatch]);

  const handleJoinQueue = async (data: { pongType: PongGameType }) => {
    try {
      const r = await joinQueue(data)
        .unwrap()
        .then((r) => {})
        .catch((e) => {});
      setOpen((prev) => ({ ...prev, queue: true }));
    } catch {
      alert("handleJoinQueue");
    }
  };

  const handleJoinBackGame = async (data: any) => {
    try {
      await joinBackGame(data).unwrap();
      console.log('"/pong?myroom=" + data.gameId', "/pong?myroom=" + data.gameId);
      router.push("/pong?myroom=" + data.gameId);

    } catch (error){
      console.log("error", error);
      dispatch(setGameData(undefined));
    }
  };

  return (
    <>
      <Stack
        height={"100%"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Stack width={"300px"} spacing={1}>
          {gameData && (
            <Button
              disabled={joinBackMutation.isLoading}
              onClick={() => {
                if (gameData.room) {
                  handleJoinBackGame({ gameId: gameData.room });
                }
              }}
              variant="contained"
              color="inherit"
            >
              JOIN BACK GAME
            </Button>
          )}
          {(!open.queue && (
            <>
              <Button
                disabled={isLoading}
                onClick={() => handleJoinQueue({ pongType: PongTypeNormal })}
                variant="contained"
                color="inherit"
              >
                Join Queue
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => handleJoinQueue({ pongType: PongTypeSpecial })}
                variant="contained"
                color="inherit"
              >
                Join Special Queue
              </Button>
            </>
          )) || (
            <>
              {open.queue && (
                <WaitingQueue
                  open={open.queue}
                  handleClose={() => {
                    setOpen((prev) => ({ ...prev, queue: false }));
                  }}
                />
              )}
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
};

// export default Games;
