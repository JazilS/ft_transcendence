import { press_Start_2P } from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from './PlayerAvatar';

interface PlayerProfileProps {
	user: UserProfile;
}

const PlayerProfile: React.FC<PlayerProfileProps> =  ({ user }) =>{
	return(
		<>
			<PlayerAvatar src={user?.imageSrc} width={162} height={162}/>
			<div className={`w-[310px] truncate text-center p-5 text-xl ${press_Start_2P.className}`}>{user?.name}</div>
		</>
	);
};


export default PlayerProfile