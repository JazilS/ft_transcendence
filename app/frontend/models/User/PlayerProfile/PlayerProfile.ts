import GameHistory from "../../GameHistory/gameHistory";

export default interface PlayerProfile {
  id: string;
  name: string | undefined;
  imageSrc: string | undefined;
  gameHistory: GameHistory[] | undefined;
}
