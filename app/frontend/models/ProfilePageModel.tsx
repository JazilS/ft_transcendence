export interface UserProfile {
	name: string;
	imageSrc: string;
	games: {
		id: string;
		date: string;
		// Autres détails de la partie
	  }[];
}