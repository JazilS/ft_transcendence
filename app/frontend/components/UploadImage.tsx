import React from 'react';
import ImageUploading from 'react-images-uploading';
import Image from 'next/image';
import CropDemo from '@/components/CropImage';

export default function UploadImage() {
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
		  }) => (
			// write your building UI
			<div className="upload__image-wrapper">
			  <button onClick={onImageUpload}> Click or Drop here </button>
			  &nbsp;
			  {imageList.map((image, index) => (
				<div key={index} className="image-item h-24">
				  <CropDemo src= {image['data_urk']}></CropDemo >

				   {/* afficher le crop */}
				   {/* faire un bouton valider qui va envoyer au back la nouvelle url de l'image*/}



				  {/* <Image src={image['data_url']} alt="" width={100} height={100}/> */}
				  {/* <div className="image-item__btn-wrapper"> */}
					{/* <button onClick={() => onImageUpdate(index)}>Update</button> */}
					{/* <button onClick={() => onImageRemove(index)}>Remove</button> */}
				  {/* </div> */}
				</div>
			  ))}
			</div>
		  )}
		</ImageUploading>
	  </div>
	);
  }