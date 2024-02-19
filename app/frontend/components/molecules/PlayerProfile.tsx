import { press_Start_2P} from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from '../atom/PlayerAvatar';
import { User } from '@/app/store/store';

interface PlayerProfileProps {
	user: User | undefined;
	width: number;
	height: number;
	displayName: boolean;
}



const PlayerProfile: React.FC<PlayerProfileProps> =  ({ user, width, height, displayName}) =>{

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