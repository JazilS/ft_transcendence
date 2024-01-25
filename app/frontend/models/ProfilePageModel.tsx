export interface UserProfile {
	name: string;
	imageSrc: string;
	isConnected: boolean;
	games: {
		id: string;
		date: string;
		opponent: string;
		opponentImageSrc: string;
		score: string;
	  }[];
}