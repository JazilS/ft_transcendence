'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '@/app/styles.css';
import Button from '@/components/atom/Button';
import { press_Start_2P, quantico } from '@/models/FontModel';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '1.5rem',
  boxShadow: 24,
  p: 4,
};

export default function NewChanModal() {
  const [open, setOpen] = React.useState(false);
  const [channelName, setChannelName] = React.useState<string>('Channel');
  const [access, setAccess] = React.useState<string>('public');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let name: string = 'channelName';

  return (
    <div>
      <Button className="active:scale-95"
				variant={'rounded'}
				size={'h_7_w_16'}
				onClick={handleOpen}>
				New
		</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className='flex flex-col'>
						<h1 className={`text-sm text-left ${press_Start_2P.className}`}>Chose a channel name :</h1>
							<input className=" w-[80%] ml-8 mt-3 mb-5 h-8 p-2 rounded-3xl text-lg bg-indigo-200  bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg placeholder:text-opacity-50 indent-2"
									placeholder='Channel Name'
									onChange={(event) => setChannelName(event.target.value)}>
							</input>
							<h1 className={`text-sm text-left mb-5 ${press_Start_2P.className}`}>Chose channel accessibility :</h1>
							<div className={`flex flex-row justify-center space-x-24 ml-8 ${quantico.className}`}>
								<div className='space-x-3'>
									<span>Public :</span>
									<input type='radio' id='public' name='access' value='public' onChange={(event) => setAccess(event.target.value)}/>
								</div>
								<div className='space-x-3'>
									<span>Private :</span>
									<input type='radio' id='private' name='access' value='private' onChange={(event) => setAccess(event.target.value)}/>
								</div>
								<div className='space-x-3'>
									<span>Protected :</span>
									<input type='radio' id='protected' name='access' value='protected' onChange={(event) => setAccess(event.target.value)}/>
							</div>
</div>
					</div>
				</Box>
			</Modal>
    </div>
  );
}
