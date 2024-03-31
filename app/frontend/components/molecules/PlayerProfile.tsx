import { press_Start_2P} from '@/models/Font/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from '../atom/PlayerAvatar';

interface PlayerProfileProps {
	user: UserProfile | undefined;
	width: number;
	height: number;
	displayName: boolean;
}



const PlayerProfile: React.FC<PlayerProfileProps> =  ({ user, width, height, displayName}) =>{

	if (!user) return null;
	return(
		<>
			<PlayerAvatar src={user?.imageSrc} width={width} height={height}/>
			{displayName ? 
				(<div className={`w-full truncate text-center p-5 text-xl mt-10 ${press_Start_2P.className}`}>
					{user?.name}
				</div>)
			: null
			}
		</>
	);
};


export default PlayerProfile