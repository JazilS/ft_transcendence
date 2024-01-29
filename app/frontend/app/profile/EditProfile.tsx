'use client'

import { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import CropDemo from '@/components/CropImage';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { press_Start_2P, quantico } from '../../models/FontModel';
import PlayerProfile from '@/components/PlayerProfile';
import '../styles.css';

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
	const [open, setOpen] = useState(false);
	const [canCrop, setCanCrop] = useState<boolean>(false);
	const handleCanCrop = () => setCanCrop(true);
	const handleCanNotCrop = () => setCanCrop(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [images, setImages] = useState([]);
	const [imageUrl, setImageUrl] = useState<string>("");
  
	const onChange = (imageList: any) => {
		console.log(imageList);
		setImages(imageList);
		if (imageList.length > 0) {
			setImageUrl(imageList[0].data_url);
		}
	};

	const handleCropImage = (onImageUpload: () => void) => {
		setCanCrop(true)
	}



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
				<div>
					<PlayerProfile user={{name: 'jsabound', imageSrc: '/Musashi.jpg', games: [], isConnected: true}} width={310} height={310}/>
				</div>
				<button className="w-[650px] h-[46px] text-center">
					<ImageUploading
						multiple
						value={images}
						onChange={onChange}
						maxNumber={1}
						dataURLKey="data_url"
					>
					{({onImageUpload}) => (
						<button className="w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center" 
							onClick={onImageUpload}> Import an image </button>
					)}
					</ImageUploading>
					<CropDemo src={imageUrl}/>
				</button>
				{/* <button className={`w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center ${quantico}`}> */}
						{/* <UploadImage/> */}
				{/* </button> */}
				<button className="w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center">Change username</button>
				
			</div>
		  </Box>
		</Modal>
	  </div>
	);
}

// gerer le update image
// mettre le crop au bon endroit