import React, { useState } from 'react';
import Image from 'next/image'
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface CropDemoProps {
  src: string;
}

export default function CropDemo({ src }: CropDemoProps) {
  const [crop, setCrop] = useState();
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [runCrop, setRunCrop] = useState<boolean | null>(true);

  const onCropChange = (newCrop: any) => {
    setCroppedImage(newCrop.getCanvas()?.toDataURL())
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };
  
  const handleConfirmCrop = () => {
	// recuperer la nouvelle image et fermer
    setRunCrop(false)
  };

//   console.log(croppedImage);
  return (
	<>
		{runCrop && (
			<div className=''>
			<Cropper
				src={src}
				crop={crop}
				aspectRatio={1}
				zoom={zoom}
				onInteractionEnd={onCropChange}
				// onTransformImageEnd={handleConfirmCrop}
				onZoomChange={onZoomChange}
				cropShape="round"
			/>
			<button onClick={handleConfirmCrop}>Confirmer le rognage</button>
			{croppedImage && (
				<div>
				<h2>Image rognée</h2>
				<Image
					style={{borderRadius: '50%'}}
					src={croppedImage}
					alt="Cropped"
					width={100}
					height={100}
				/>
				</div>
			)}
			</div>
		)}
	</>
	);
}
