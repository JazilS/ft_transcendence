import { Press_Start_2P } from 'next/font/google'
import "../app/styles.css"

export default function MyHeader(){
    return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<ul className="bg-gradient-to-b from-black to-transparente h-36 px-8 flex gap-16 items-center">
				<li>
					<PlayButton />
				</li>
				<li>
					<ChatButton />
				</li>
				<li>
					<ProfileButton />
				</li>				
				<li>
					<SettingsButton />
				</li>
			</ul>
		</div>
	);
};

const PlayButton: React.FC = () => {
	  return (
			  <button className={`w-[108px] h-[41px] text-fuchsia-200 text-2xl ${press_Start_2P.className}`}>
				play
			  </button >
	  );
  };
  
const ChatButton: React.FC = () => {
	  return (
			  <button className={`w-[108px] h-[41px] text-fuchsia-200 text-2xl ${press_Start_2P.className}`}>
				chat
			  </button >
	  );
  };

const ProfileButton: React.FC = () => {
    return (
			<button className={`w-[108px] h-[41px] text-fuchsia-200 text-2xl ${press_Start_2P.className}`}>
				profile
			</button>
    );
};


const SettingsButton: React.FC = () => {
    return (
            <button className={` w-[108px] h-[41px] text-fuchsia-200 text-2xl  ${press_Start_2P.className}`}>
              settings
            </button >
    );
};


const press_Start_2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  })

