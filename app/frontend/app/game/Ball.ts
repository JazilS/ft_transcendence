import { Coordinate } from "./types";
import { BALL_HALF_WIDTH } from "../../../shared/constant";

export class Ball {
  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    position: Coordinate
  ) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(
      position.x * canvas.width,
      position.y * canvas.height,
      BALL_HALF_WIDTH * canvas.width,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  }
}
