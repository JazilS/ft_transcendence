'use client'

import React, { useState, createRef } from 'react'
import '../styles.css'
import MyHeader from '@/components/Header'
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

import Image from 'next/image';
import ReactCrop, {Crop} from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
// import Cropper from 'react-easy-crop'
// import Cropper, { ReactCropperElement } from "react-cropper";
import { blue } from '@mui/material/colors';


export default function ProfilePage() {
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader />
			<Profile/>
		</div>
  );
}


const Profile: React.FC = () => {
	let username:string
	username = "kgezgin"
	return (
		<div className='flex justify-center'>
			{/* <div className="flex flex-row w-5/6 h-[789px] bg-white rounded-3xl">
				<div className='h-[738px] w-[315px] ml-7 mt-7 flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'>
					<div className="rounded-full mb-10 bg-white h-[162px] w-[162px]">
					</div>
					{username}

				</div>
				<div className='h-[738px] w-[855px] ml-7 mt-7 mr-7 bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500  '>

				</div>
				<div className='h-[738px] w-[315px] mt-7 bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'>
				
				</div>
			</div> */}
								<CropDemo src= "/Pong.jpg"></CropDemo>

		</div>
	);
};





interface CropDemoProps {
  src: string;
}

const CropDemo: React.FC<CropDemoProps> = ({ src }) => {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     console.log(croppedArea, croppedAreaPixels)
//   }

console.log()


const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
  const [image] = useState(
	'https://images.unsplash.com/photo-1599140849279-1014532882fe?fit=crop&w=1300&q=80',
);

const onChange = (cropper: CropperRef) => {
	console.log(cropper.getCoordinates(), cropper.getImage());
};

  return (
	<div>
     <Cropper
            src={src}
            onChange={onChange}
            className={'cropper'}
        />;

	</div>
  );
};

    {/* <Cropper
         ref={cropperRef}
		 style={{ height: '400', width: '100%' }}
		zoomable={false}		 
		 //  initialAspectRatio={1}
		 preview=".img-preview"
		 src={image}
		 background={false}
		 responsive={true}
		 autoCropArea={1}
		 guides={true}
    /> */}

// const HistoryGame: React.FC = () => {
	// return (
		// 
	// );
// };