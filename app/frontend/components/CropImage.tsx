import React, { useState } from 'react';
import Image from 'next/image'
import { Cropper } from 'react-advanced-cropper';
import { UserProfile } from "@/models/ProfilePageModel";
import { press_Start_2P, quantico } from "@/models/FontModel";
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
	<div className='flex flex-col items-center space-y-5 mb-14'>
			<div className=' w-fit max-w-[880px] h-[336px] flex flex-col'>
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
						height: "400px",
						borderRadius: "25px"
					}}
				/>
			</div>
			<button
				className={`bg-gradient-to-r from-indigo-800 to-fuchsia-800 text-white rounded-full p-2 px-28 ${quantico.className}`}
				onClick={handleConfirmCrop}>
				Confirmer le rognage
				</button>
	</div>)
}
