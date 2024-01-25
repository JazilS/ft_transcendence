'use client'

import CropDemo from '@/components/CropImage';
import MyHeader from '@/components/Header';
import UploadExample from '@/components/CropImage';
import App from '@/components/CropImage'

export default function ChatPage() {
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader /> 
			<div className="h-96 w-96 ">
				<App></App>
				{/* <UploadExample></UploadExample> */}
				{/* <CropDemo src= "/Pong.jpg"></CropDemo > */}
			</div>
		</div>
		)
}