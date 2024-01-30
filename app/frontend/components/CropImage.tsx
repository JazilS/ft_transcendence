import React, { useState } from 'react';
import Image from 'next/image'
import { Cropper } from 'react-advanced-cropper';
import { UserProfile } from "@/models/ProfilePageModel";
import 'react-advanced-cropper/dist/style.css';

interface CropDemoProps {
  src: string;
	user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onCLose: Function;

}

export default function CropDemo({src, user, setUser, onCLose}: CropDemoProps){

  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropChange = (newCrop: any) => {
    setCroppedImage(newCrop.getCanvas()?.toDataURL())
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };
  
  const handleConfirmCrop = (event: any) => {
		if (croppedImage) {
  	  setUser({ ...user,imageSrc: croppedImage  });
		onCLose();
		}
  };

  console.log(src);
  return (
	<>
			<div className='w-[886px] h-[400px] flex flex-col space-x-10'>
				<Cropper
					src={src}
					aspectRatio={1}
					zoom={zoom}
					onInteractionEnd={onCropChange}
					// onTransformImageEnd={handleConfirmCrop}
					onZoomChange={onZoomChange}
					cropShape="round"
					style={{
						width: "auto",
						height: "auto"
					}}
				/>
				<button onClick={handleConfirmCrop}>Confirmer le rognage</button>
			</div>
	</>)
}
