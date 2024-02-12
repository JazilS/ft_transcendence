import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';

export default function UploadImage() {
	const [images, setImages] = useState([]);
	const [imageUrl, setImageUrl] = useState<string>("");
  
	const onChange = (imageList: any) => {
		console.log(imageList);
		setImages(imageList);
		if (imageList.length > 0) {
			setImageUrl(imageList[0].data_url);
		}
	};

	// const handleCropImage = () => {
	// 	<CropDemo src={imageUrl} />
	// }

	return (
		<button className="w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center">
			<ImageUploading
				multiple
				value={images}
				onChange={onChange}
				maxNumber={1}
				dataURLKey="data_url"
			>
				{({onImageUpload}) => (
					<div>
						<button className="w-[650px] h-[46px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[50px] text-center" 
								onClick={onImageUpload}> Import an image </button>
					</div>
				)}
				
			</ImageUploading>
		</button>
		);
	}

// export default function UploadImage({ open, handleAvatarClose }) {
// 	const [images, setImages] = useState([]);
// 	const [imageUrl, setImageUrl] = useState<string>("");
// 	const [AvatarOpen, setAvatarOpen] = React.useState(false);

// 	const handleAvatarClose = () => setAvatarOpen(false);
// 	const handleAvatarOpen = () => setAvatarOpen(true);
	
// 	const maxNumber = 69;

// 	const onChange = (imageList: any) => {
// 	  // data for submit
// 	  console.log(imageList);
// 	  setImages(imageList);
// 	  if (imageList.length > 0) {
// 		setImageUrl(imageList[0].data_url);
// 	};
// }

// 	return (
// 		<Modal
// 			open={open}
// 			onClose={handleAvatarClose}
// 			aria-labelledby="modal-modal-title"
// 			aria-describedby="modal-modal-description"
// 		>
// 			<Box sx={style}>
// 				<ImageUploading
// 					multiple
// 					value={images}
// 					onChange={onChange}
// 					maxNumber={maxNumber}
// 					dataURLKey="data_url"
// 					>
// 					{({
// 						imageList,
// 						onImageUpload,
// 					}) => (
// 						<div className="upload__image-wrapper">
// 						<button onClick={onImageUpload}> Click or Drop here </button>
// 						&nbsp;
// 						{imageList.map((image, index) => (
// 							<div key={index} className="image-item h-24">
// 							{/* <Image src={image['data_url']} alt="" width={100} height={100}/> */}
// 							</div>
// 						))}
// 					</div>
// 					)}
// 				</ImageUploading>
// 				<CropDemo src={imageUrl}></CropDemo >
// 			</Box>
// 		</Modal>
// 	);
//   }