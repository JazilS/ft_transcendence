"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../styles.css";
import { press_Start_2P, quantico} from "../../models/FontModel";
import { UserProfile } from "@/models/ProfilePageModel";
import CropDemo from "@/components/CropImage";
import { Backdrop, Button, colors } from "@mui/material";



export default function EditProfileButton({
  user,
  setUser,
  setBlur,
}: {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setBlur: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleOpen = () => {
	setOpen(true);
	setBlur(true);
}

  const handleClose = () => {
    setOpen(false);
	setBlur(false);
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
				<div className=" w-full h-full flex flex-col items-center space-y-10">
					<div className="flex">
						<CropDemo 
							onCLose={handleClose}
							src={imageUrl ? URL.createObjectURL(imageUrl) : user.imageSrc} 
							user={user} 
							setUser={setUser}
						/>
					</div>
					<Button
						component="label"
						variant="contained"
						style={{
							...quantico.style,
							fontSize: 'large',
							textAlign: 'center',
							paddingTop: '12px',
							paddingBottom: '12px',
							paddingLeft: '90px',
							paddingRight: '90px'
						}}
						sx={{
							borderRadius: 50,
							background: 'linear-gradient(to right, #6366f1, #d946ef)',
						  }}
					>
						Upload file
						<input 
							style={{
								display: 'none'
							}} 
							onChange={onChange} 
							type="file" />
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
  width: "auto",
  height: "auto",
  bgcolor: "rgba(254, 254, 254, 0.4)",
  borderRadius: "1.5rem",
  boxShadow: 24,
  p: 4,
};
