'use client'

import { Press_Start_2P } from 'next/font/google'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../styles.css';
import { press_Start_2P } from '../../models/FontModel';
import PlayerProfile from '@/components/PlayerProfile';

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

export default function EditProfileButton() {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
  
	return (
	  <div>
		<button onClick={handleOpen} className={`${press_Start_2P.className} text-black `}>edit</button>
		<Modal
		  open={open}
		  onClose={handleClose}
		  aria-labelledby="modal-modal-title"
		  aria-describedby="modal-modal-description"
		>
		  <Box sx={style}>
			<div className='w-full h-full flex justify-center'>
				<div className='flex flex-col'>
					<	PlayerProfile user={{name: 'Player 1', imageSrc: '/Musashi.jpg', games: []}} width={310} height={310}/>
				</div>
			</div>
		  </Box>
		</Modal>
	  </div>
	);
}