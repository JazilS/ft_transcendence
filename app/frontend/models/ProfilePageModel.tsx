export interface UserProfile {
	name: string;
	imageSrc: string;
	games: {
		id: string;
		date: string;
		opponent: string;
		score: string;
		// Autres détails de la partie
	  }[];
}