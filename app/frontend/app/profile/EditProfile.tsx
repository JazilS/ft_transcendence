'use client'

import {useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../styles.css';
import { press_Start_2P } from '../../models/FontModel';
import PlayerAvatar from '@/components/PlayerAvatar';
import {TextField} from '@mui/material'
import { UserProfile } from '@/models/ProfilePageModel';



export default function EditProfileButton({ user, setUser }: { user: UserProfile, setUser: React.Dispatch<React.SetStateAction<UserProfile>> }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleUsernameChange = (value: string) => {
		setUser({ ...user, name: value });
	};
	return (
	  <div>
		<button onClick={handleOpen} className={`${press_Start_2P.className} text-white `}>edit</button>
		<Modal
		  open={open}
		  onClose={handleClose}
		  aria-labelledby="modal-modal-title"
		  aria-describedby="modal-modal-description"
		>
		  <Box sx={style}>
			<div className='w-full h-full flex flex-col items-center space-y-10'>
				<PlayerAvatar src={'/Musashi.jpg'} width={310} height={310}/>
				<div>
				<TextField
				style={{borderRadius: '5%', marginTop: '2vh'}}
				onChange={(event) => handleUsernameChange(event.target.value)}
				value={user ? user.name : 'User'}
				/>
				</div>
					<button className="w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center text-white font-['Quantico'] text-3xl">
						Change avatar
					</button>
			</div>
		  </Box>
		</Modal>
	  </div>
	);
}


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '950px',
	height: '740px',
	bgcolor: 'background.paper',
	borderRadius: '1.5rem',
	boxShadow: 24,
	p: 4,
  };