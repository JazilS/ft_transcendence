export interface UserProfile {
	name: string;
	imageSrc: string;
	isConnected: boolean;
	games: {
		id: string;
		date: string;
		opponent: string;
		opponentImageSrc: string;
		scoreUser: number;
		scoreOpponent: number;
	  }[];
}
