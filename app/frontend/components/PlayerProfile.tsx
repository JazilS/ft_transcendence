import Image from "next/image";
import { Press_Start_2P } from 'next/font/google'
import { UserProfile } from '@/models/ProfilePageModel'

const press_Start_2P = Press_Start_2P({
	subsets: ['latin'],
	weight: '400'
})

interface BodyProps {
	user: UserProfile;
	}

const PlayerProfile: React.FC<BodyProps> =  ({ user }) =>{
	return(
		<>
			<div className="rounded-full mb-10 bg-white h-[162px] w-[162px] justify-center items-center overflow-hidden">
			<Image src={user?.imageSrc || ''} alt="profile picture" width={162} height={162}></Image>
			</div>
			<div className={`w-[310px] truncate text-center p-5 text-xl ${press_Start_2P.className}`}>{user?.name}</div>
		</>
	);
};


export default PlayerProfile