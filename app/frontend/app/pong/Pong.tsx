"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import usePageSize from "@/app/game/utils/usePageSize";
import {
  GAME_MARGIN,
  ASPECT_RATIO,
  PADDLE_HEIGHT,
} from "../../shared/constant";
import { PongEvent } from "../../shared/socketEvent";
import { RootState } from "../store/store";
import { StartGameInfo } from "../../shared/types";
import { Ball } from "./Ball";
import { Player } from "./Player";
import { ConnectSocket } from "../utils/getSocket";
import { mySocket } from "../utils/getSocket";
import { UpdatedGameData } from "../../../shared/types";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import { setGameData } from "../store/features/Game/GameSlice";
import { useParams } from "react-router-dom";

export const Pong = () => {
  const dispatch = useAppDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();
  const search = useSearchParams();
  const room = search.get("myroom");
  console.log("*************ROOM", room);
  const [score, setScore] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });

  const { width, height } = usePageSize();

  const gameWidth = Math.min(
    width - 2 * GAME_MARGIN,
    (height - 2 * GAME_MARGIN) * ASPECT_RATIO
  );
  // console.log("GAME WIDTH", gameWidth);
  const gameHeight = gameWidth / ASPECT_RATIO;
  // console.log("GAME HEIGHT", gameHeight);

  const keyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key, code } = event;
      if (code === PongEvent.ARROW_UP || key === PongEvent.ARROW_UP) {
        console.log("ARROw UP");
        mySocket.emit(PongEvent.UPDATE_PLAYER_POSITION, {
          gameId: room,
          keyPressed: code,
        });
      } else if (
        code === PongEvent.ARROW_DOWN ||
        key === PongEvent.ARROW_DOWN
      ) {
        console.log("ARROw DOWN");
        mySocket.emit(PongEvent.UPDATE_PLAYER_POSITION, {
          gameId: room,
          keyPressed: code,
        });
      }
    },
    [room]
  );

  const keyup = useCallback(
    (event: KeyboardEvent) => {
      const { key, code } = event;
      if (code === PongEvent.ARROW_UP || key === PongEvent.ARROW_UP) {
        mySocket.emit(PongEvent.USER_STOP_UPDATE, {
          gameId: room,
          keyPressed: code,
        });
      } else if (
        code === PongEvent.ARROW_DOWN ||
        key === PongEvent.ARROW_DOWN
      ) {
        mySocket.emit(PongEvent.USER_STOP_UPDATE, {
          gameId: room,
          keyPressed: code,
        });
      }
    },
    [room]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = gameWidth;
    canvas.height = gameHeight;
    canvas.style.width = `${gameWidth}px`;
    canvas.style.height = `${gameHeight}px`;

    context.fillStyle = "green";

    const ball = new Ball();
    console.log("BALL", ball);
    const Player1 = new Player(canvas, context, {
      height: PADDLE_HEIGHT,
      width: 0.015,
    });
    console.log("PLAYER 1", Player1);

    const Player2 = new Player(canvas, context, {
      height: PADDLE_HEIGHT,
      width: 0.015,
    });
    console.log("PLAYER 2", Player2);

    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyup);

    ConnectSocket();

    mySocket.on(PongEvent.UPDATE_GAME, (data: { data: UpdatedGameData }) => {
      const { player1, player2, coordinates } = data.data;
      setScore({ player1: player1.score, player2: player2.score });
      context.clearRect(0, 0, canvas.width, canvas.height);
      coordinates.forEach((coordinate) => {
        ball.draw(canvas, context, coordinate);
      });
      Player1.draw(player1);
      Player2.draw(player2);
    });

    mySocket.on(PongEvent.END_GAME, (data) => {
      dispatch(setGameData(undefined));
      router.push("/game");
    });

    mySocket.on(PongEvent.USER_NO_MORE_IN_GAME, (data) => {
      dispatch(setGameData(undefined));
      router.push("/game");
    });

    return () => {
      document.removeEventListener("keydown", keyPress);
      document.removeEventListener("keyup", keyup);
      mySocket.off(PongEvent.UPDATE_GAME);
      mySocket.off(PongEvent.END_GAME);
      mySocket.off(PongEvent.USER_NO_MORE_IN_GAME);
    };
  }, [
    canvasRef,
    height,
    width,
    gameHeight,
    gameWidth,
    dispatch,
    keyPress,
    keyup,
    router,
  ]);
  return (
    <Stack
      width={"100%"}
      alignItems={"center"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      position={"relative"}
    >
      <Stack
        width={gameWidth}
        top={"10%"}
        position={"absolute"}
        direction={"row"}
        justifyContent={"space-around"}
      >
        <Typography variant="h1">{score.player1}</Typography>
        <Typography variant="h1">{score.player2}</Typography>
      </Stack>
      <canvas
        style={{
          width: gameWidth,
          height: gameHeight,
          border: "5px solid black",
        }}
        ref={canvasRef}
        width={gameWidth}
        height={gameHeight}
      />
    </Stack>
  );
};
