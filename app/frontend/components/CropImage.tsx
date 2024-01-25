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

  const onCropChange = (newCrop: any) => {
    setCroppedImage(newCrop.getCanvas()?.toDataURL())
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  console.log(croppedImage);
  return (
    <div className='testt'>
      <Cropper
        src={src}
        crop={crop}
        aspectRatio={1}
        zoom={zoom}
        onChange={onCropChange}
        onZoomChange={onZoomChange}
        cropShape="round"
      />

      {croppedImage && (
        <div className='yoooooo'>
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
  );
}
