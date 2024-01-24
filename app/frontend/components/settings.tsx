'use client'

import { Press_Start_2P } from 'next/font/google'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../app/styles.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '1.5rem',
  boxShadow: 24,
  p: 4,
};

export default function SettingsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button onClick={handleOpen} className={`${press_Start_2P.className} text-white `}>settings</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <button className=" w-[325px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-[50px] text-center">  
              Enable double auth.
            </button>
        </Box>
      </Modal>
    </div>
  );
}

const press_Start_2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400'
})