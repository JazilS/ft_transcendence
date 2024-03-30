// import MyHeader from "@/components/organism/Header";
// import "../styles.css";
// import "./styles.css";
// import Button from "@/components/atom/Button";
// import Link from "next/link";
// export default function GamePage() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const dispatch = useAppDispatch();
//   const [score, setScore] = useState<{ player1: number; player2: number }>({
//     player1: 0,
//     player2: 0,
//   });
//   const { width, height } = usePageSize();

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Pong } from "./Pong";

export default function PongPage() {
  return (
    <Provider store={store}>
      <Pong />
    </Provider>
  );
}
