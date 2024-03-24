'use client'

import { Press_Start_2P } from 'next/font/google'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../app/styles.css';
import Link from 'next/link';

export const style = {
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
  console.log('SettingsModal is rendering'); // Ajout du console.log ici

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }


  return (
    <div>
      <button onClick={handleOpen} className={`${press_Start_2P.className} text-white hover:scale-110 active:hover:disabled`}>settings</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex flex-col space-y-12'>
            <Link href="/qrCode">
              <button className=" w-[325px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-[50px] text-center">  
                Enable double auth.
              </button>
            </Link>
            <button className=" w-[325px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-[50px] text-center" onClick={handleLogout}>  
              Logout.
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const press_Start_2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400'
})