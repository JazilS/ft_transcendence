// import { CropperRef, Cropper } from 'react-advanced-cropper';
// import 'react-advanced-cropper/dist/style.css'
// import {useState} from 'react';

// interface CropDemoProps {
//   src: string;
// }

// export default function CropDemo({ src }: { src: string }) {

//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)

// 	const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
// 	console.log(croppedArea, croppedAreaPixels)
// 	}

// console.log()

// 	const defaultSrc =
// 	"https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
// 	const [image] = useState(
// 		'https://images.unsplash.com/photo-1599140849279-1014532882fe?fit=crop&w=1300&q=80',
// 	)
// ;}

// import React, { useState } from 'react';
// import { Cropper } from 'react-advanced-cropper';
// import 'react-advanced-cropper/dist/style.css';

// interface CropDemoProps {
//   src: string;
// }

// export default function CropDemo({ src }: CropDemoProps) {
// 	const [crop, setCrop] = useState({ x: 0, y: 0 });
// 	const [zoom, setZoom] = useState(1);
  
// 	const [croppedImage, setCroppedImage] = useState<string | null>(null);
  
// 	const onCropChange = (newCrop: any) => {
// 	  setCrop(newCrop);
// 	};
  
// 	const onZoomChange = (newZoom: number) => {
// 	  setZoom(newZoom);
// 	};
  
// 	const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
// 	  console.log(croppedArea, croppedAreaPixels);
  
// 	  // Obtenez les coordonnées de la zone rognée en pixels
// 	  const { x, y, width, height } = croppedAreaPixels;
  
// 	  // Utilisez ces coordonnées pour extraire la partie rognée de l'image originale
// 	  const canvas = document.createElement('canvas');
// 	  const ctx = canvas.getContext('2d');
  
// 	  if (ctx) {
// 		const image = new Image();
// 		image.src = image;
// 		canvas.width = width;
// 		canvas.height = height;
  
// 		image.onload = () => {
// 		  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
// 		  const dataUrl = canvas.toDataURL('image/png');
// 		  setCroppedImage(dataUrl);
// 		};
// 	  }
// 	};
  
// 	const defaultSrc =
// 	  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
// 	const [image] = useState(
// 	  'https://images.unsplash.com/photo-1599140849279-1014532882fe?fit=crop&w=1300&q=80',
// 	);
  
//   return (
//     <div className='bg-gray-500 '>
//       <Cropper
//         src={src}
//         crop={crop}
//         onCropChange={setCrop}
//         onCropComplete={onCropComplete}
//         aspectRatio={1}
//         cropShape="rect"
//       />
//       <button onClick={() => onCropComplete(crop, zoom)}>Terminer le rognage</button>
//     </div>
//   );
// }




















// import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
// import Image from 'next/image'
// import { Cropper } from 'react-advanced-cropper';
// import 'react-advanced-cropper/dist/style.css';

// interface CropDemoProps {
//   src: string;
// }

// export default function CropDemo({ src }: CropDemoProps) {
//   const [crop, setCrop] = useState();
//   const [zoom, setZoom] = useState(1);
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);

//   const onCropChange = (newCrop: any) => {
//     setCroppedImage(newCrop.getCanvas().toDataURL())
//   };

//   const onZoomChange = (newZoom: number) => {
//     setZoom(newZoom);
//   };

//   const onCropComplete = () => {
 
//   };

//   console.log(croppedImage);
//   return (
//     <div>
//       <Cropper
//         src={src}
//         crop={crop}
//         aspectRatio={1}
//         zoom={zoom}
//         onChange={onCropChange}
//         onZoomChange={onZoomChange}
//         cropShape="round"
//       />

//       {croppedImage && (
//         <div>
//           <h2>Image rognée</h2>
//           <Image
//           style={{borderRadius: '50%'}}
//             src={croppedImage}
//             alt="Cropped"
//             width={100}
//             height={100}
//           />
//         </div>
//       )}
//     </div>
//   );
// }















// import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
// import { CropperRef, Cropper } from 'react-advanced-cropper';

// interface Image {
//     type?: string;
//     src: string;
// }

// export const UploadExample = () => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     const [image, setImage] = useState<Image | null>(null);

//     const onUpload = () => {
//         if (inputRef.current) {
//             inputRef.current.click();
//         }
//     };

//     const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
//         // Reference to the DOM input element
//         const { files } = event.target;

//         // Ensure that you have a file before attempting to read it
//         if (files && files[0]) {
//             // Create the blob link to the file to optimize performance:
//             const blob = URL.createObjectURL(files[0]);

//             // Get the image type from the extension. It's the simplest way, though be careful it can lead to an incorrect result:
//             setImage({
//                src: blob,
//                type: files[0].type
//             })
//         }
//         // Clear the event target value to give the possibility to upload the same image:
//         event.target.value = '';
//     };

//     useEffect(() => {
//         // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
//         return () => {
//             if (image && image.src) {
//                 URL.revokeObjectURL(image.src);
//             }
//         };
//     }, [image]);

//     return (
//         <div className="upload-example">
//             <Cropper className="upload-example__cropper" src={image && image.src} />
//             <div className="buttons-wrapper">
//                 <button className="button" onClick={onUpload}>
//                     <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
//                     Upload image
//                 </button>
//             </div>
//         </div>
//     );
// };





// import { getMimeType } from 'advanced-cropper/extensions/mimes';

// interface Image {
//     type?: string;
//     src: string;
// }

// export const UploadExample = () => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     const [image, setImage] = useState<Image | null>(null);

//     const onUpload = () => {
//         if (inputRef.current) {
//             inputRef.current.click();
//         }
//     };

//     const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
//         // Reference to the DOM input element
//         const { files } = event.target;

//         // Ensure that you have a file before attempting to read it
//         if (files && files[0]) {
//             // Create the blob link to the file to optimize performance:
//             const blob = URL.createObjectURL(files[0]);

//             // Remember the fallback type:
//             const typeFallback = files[0].type;

//             // Create a new FileReader to read this image binary data
//             const reader = new FileReader();

//             // Define a callback function to run, when FileReader finishes its job
//             reader.onload = (e) => {
//                 // Note: arrow function used here, so that "this.image" refers to the image of Vue component
//                 setImage({
//                     // Read image as base64 and set it as src:
//                     src: blob,
//                     // Determine the image type to preserve it during the extracting the image from canvas:
//                     type: getMimeType(e.target?.result, typeFallback),
//                 });
//             };
//             // Start the reader job - read file as a data url (base64 format) and get the real file type
//             reader.readAsArrayBuffer(files[0]);
//         }
//         // Clear the event target value to give the possibility to upload the same image:
//         event.target.value = '';
//     };

//     useEffect(() => {
//         // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
//         return () => {
//             if (image && image.src) {
//                 URL.revokeObjectURL(image.src);
//             }
//         };
//     }, [image]);

//     return (
//         <div className="upload-example">
//             <Cropper className="upload-example__cropper" src={image && image.src} />
//             <div className="buttons-wrapper">
//                 <button className="button" onClick={onUpload}>
//                     <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} />
//                     Upload image
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default UploadExample















import React from 'react';
import ImageUploading from 'react-images-uploading';
import Image from 'next/image';

export default function App() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <Image src={image['data_url']} alt="" width={100} height={100}/>
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}