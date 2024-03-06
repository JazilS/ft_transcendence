import MyHeader from "@/components/organism/Header";
import "../styles.css";
import "./styles.css";
import Button from "@/components/atom/Button";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const [score, setScore] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });
  const { width, height } = usePageSize();

  const navigate = useNavigate();
  const gameWidth = Math.min(
    width - 2 * GAME_MARGIN,
    (height - 2 * GAME_MARGIN) * ASPECT_RATIO
  );
  const gameHeight = gameWidth / ASPECT_RATIO;

  const keyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key, code } = event;
      if (code === PongEvent.ARROW_UP || key === PongEvent.ARROW_UP) {
        socket.emit(PongEvent.UPDATE_PLAYER_POSITION, {
          gameId: room,
          keyPressed: code,
        });
      } else if (
        code === PongEvent.ARROW_DOWN ||
        key === PongEvent.ARROW_DOWN
      ) {
        socket.emit(PongEvent.UPDATE_PLAYER_POSITION, {
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
        socket.emit(PongEvent.USER_STOP_UPDATE, {
          gameId: room,
          keyPressed: code,
        });
      } else if (
        code === PongEvent.ARROW_DOWN ||
        key === PongEvent.ARROW_DOWN
      ) {
        socket.emit(PongEvent.USER_STOP_UPDATE, {
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

    context.fillStyle = "black";

    window.addEventListener("keydown", keyPress);

    window.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keydown", keyPress);
      document.removeEventListener("keyup", keyup);
    };
  }, [
    navigate,
    canvasRef,
    height,
    width,
    gameHeight,
    gameWidth,
    dispatch,
    room,
    creator,
    opponent,
    keyPress,
    keyup,
  ]);
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <canvas
        style={{
          width: gameWidth,
          height: gameHeight,
          border: "1px solid white",
        }}
        ref={canvasRef}
        width={gameWidth}
        height={gameHeight}
      />
    </div>
  );
}