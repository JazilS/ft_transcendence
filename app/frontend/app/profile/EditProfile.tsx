// 'use client'

// const style = {
// 	position: 'absolute',
// 	top: '50%',
// 	left: '50%',
// 	transform: 'translate(-50%, -50%)',
// 	width: '950px',
// 	height: '740px',
// 	bgcolor: 'background.paper',
// 	borderRadius: '1.5rem',
// 	boxShadow: 24,
// 	p: 4,
//   };

// export default function EditProfileButton() {
// 	const [open, setOpen] = useState(false);
// 	const [canCrop, setCanCrop] = useState<boolean>(false);
// 	const handleCanCrop = () => setCanCrop(true);
// 	const handleCanNotCrop = () => setCanCrop(false);
// 	const handleOpen = () => setOpen(true);
// 	const handleClose = () => setOpen(false);
// 	const [images, setImages] = useState([]);
// 	const [imageUrl, setImageUrl] = useState<string>("");

// 	const onChange = (imageList: any) => {
// 		console.log(imageList);
// 		setImages(imageList);
// 		if (imageList.length > 0) {
// 			setImageUrl(imageList[0].data_url);
// 		}
// 	};

// 	const handleCropImage = () => {
// 		setCanCrop(true);
// 		// setOpen(false); // Fermer la modal après avoir déclenché le recadrage
// 	  };

// 	const handleUsernameChange = (value: string) => {
// 		setUser({ ...user, name: value });
// 	};

// 	return (
// 	  <div>
// 		<button onClick={handleOpen} className={`${press_Start_2P.className} text-white `}>edit</button>
// 		<Modal
// 		  open={open}
// 		  onClose={handleClose}
// 		  aria-labelledby="modal-modal-title"
// 		  aria-describedby="modal-modal-description"
// 		>
// 		  <Box sx={style}>
// 			<div className='w-full h-full flex flex-col items-center space-y-10'>
// 				<div>
// 					<PlayerProfile user={{name: 'jsabound', imageSrc: '/Musashi.jpg', games: [], isConnected: true}} width={310} height={310}/>
// 					<TextField
// 				style={{borderRadius: '5%', marginTop: '2vh'}}
// 				onChange={(event) => handleUsernameChange(event.target.value)}
// 				value={user ? user.name : 'User'}
// 				/>
// 				</div>

// 			</div>
// 		  </Box>
// 		</Modal>
// 	  </div>
// 	);
// }

// gerer le update image
// mettre le crop au bon endroit

"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../styles.css";
import { press_Start_2P } from "../../models/FontModel";
import PlayerAvatar from "@/components/PlayerAvatar";
import { TextField } from "@mui/material";
import { UserProfile } from "@/models/ProfilePageModel";
import ImageUploading from "react-images-uploading";
import PlayerProfile from "@/components/PlayerProfile";
import CropDemo from "@/components/CropImage";
import { Button } from "@mui/material";



export default function EditProfileButton({
  user,
  setUser,
}: {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (event: any) => {
      setImageUrl(event.target.files[0]);
  };

  return (
	<div>
		<button
			onClick={handleOpen}
			className={`${press_Start_2P.className} text-white `}
		>
			edit
		</button>
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<div className="w-full h-full flex flex-col items-center space-y-10">
					<div className="flex">
						<CropDemo 
							onCLose={handleClose}
							src={imageUrl ? URL.createObjectURL(imageUrl) : user.imageSrc} 
							user={user} 
							setUser={setUser}
						/>
					</div>
					<Button component="label" variant="contained">
						Upload file
						<input onChange={onChange} style={{visibility: 'hidden'}} type="file" />
					</Button>
				</div>
			</Box>
		</Modal>
	</div>
	);
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "950px",
  height: "740px",
  bgcolor: "background.paper",
  borderRadius: "1.5rem",
  boxShadow: 24,
  p: 4,
};
