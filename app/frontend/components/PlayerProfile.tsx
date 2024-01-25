import { press_Start_2P } from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from './PlayerAvatar';

interface PlayerProfileProps {
	user: UserProfile;
	width: number;
	height: number;
}

export default function PlayerProfile({ user, width, height }: PlayerProfileProps) {
	return(
		<>
			<PlayerAvatar src={user?.imageSrc} width={width} height={height}/>
			<p className={`w-full truncate text-center p-5 text-xl mt-10 ${press_Start_2P.className}`}>{user?.name}</p>
		</>
	);
};

