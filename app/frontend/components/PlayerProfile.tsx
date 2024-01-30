import { press_Start_2P, quantico } from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel'
import PlayerAvatar from './PlayerAvatar';
import { TextField } from "@mui/material";

interface PlayerProfileProps {
	user: UserProfile;
	width: number;
	height: number;
	setUser: Function;
}



const PlayerProfile: React.FC<PlayerProfileProps> =  ({ user, width, height, setUser}) =>{
	

	const handleUsernameChange = (value: string) => {
		setUser({ ...user, name: value });
	  };
	

	return(
		<>
			<PlayerAvatar src={user?.imageSrc} width={width} height={height}/>
			<TextField
				inputProps={{
					style: {
						textAlign: "center",
						...quantico.style
					}
				}}
				InputProps={{
					style: {
						borderRadius: "50px",
						background: 'rgba(255, 255, 255, 0.5)',
						border: 'none',
					}
				}}
				// aria-setsize={}
				size='small'
				onChange={(event) => handleUsernameChange(event.target.value)}
				value={user ? user.name : "User"}
			/>
		</>
	);
};


export default PlayerProfile