import { press_Start_2P } from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from './PlayerAvatar';

interface PlayerProfileProps {
	user: UserProfile;
	width: number;
	height: number;
}

const PlayerProfile: React.FC<PlayerProfileProps> =  ({ user, width, height}) =>{
	return(
		<>
			<PlayerAvatar src={user?.imageSrc} width={width} height={height}/>
			<div className={`w-[310px] truncate text-center p-5 text-xl mt-10 ${press_Start_2P.className}`}>{user?.name}</div>
		</>
	);
};


export default PlayerProfile