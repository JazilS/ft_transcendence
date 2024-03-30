import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import {
  useJoinBackCurrentGameMutation,
  useJoinQueueMutation,
} from "../store/features/Game/game.api.slice";
import {
  PongGameType,
  PongTypeNormal,
  PongTypeSpecial,
} from "@/shared/constant";
import { set } from "zod";
import { setGameData } from "../store/features/Game/GameSlice";
import { Button, Stack } from "@mui/material";
import WaitingQueue from "./WaitingQueue";
import Image from "next/image";
import { PermDeviceInformationTwoTone } from "@mui/icons-material";

export const Games = () => {
  const [open, setOpen] = useState<{ queue: boolean }>({ queue: false });
  const gameData = useAppSelector((state: RootState) => state.game.gameData);
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [joinQueue, { isLoading }] = useJoinQueueMutation();
  const [joinBackGame, joinBackMutation] = useJoinBackCurrentGameMutation();

  const handleJoinQueue = async (data: { pongType: PongGameType }) => {
    try {
      const r = await joinQueue(data)
        .unwrap()
        .then((r) => {
          // console.log("R", r);
          // setLoadingIMG(false);
        })
        .catch((e) => {
          console.log("E", e);
        });

      setOpen((prev) => ({ ...prev, queue: true }));
    } catch {
      alert("handleJoinQueue");
    }
  };

  const handleJoinBackGame = async (data: { gameId: string }) => {
    try {
      await joinBackGame(data).unwrap();
      // navigate("/game/pong");
    } catch {
      alert("handleJoinBackGame");
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
