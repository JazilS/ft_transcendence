import Button from "../Button";
import { quantico } from "@/models/FontModel";

export default function SwitchChat({
  setIsChan,
}: {
  setIsChan: React.Dispatch<React.SetStateAction<boolean>>;
})
{
	const handleSetIsChan = (value:boolean) => {
		setIsChan(value);
	}

	return (
		<div className={`flex flex-row h-[35px] ${quantico.className}`}>
			<Button
				onClick={() => handleSetIsChan(true)}
				className="bg-[#9EB7F6] hover:text-xl"
				variant={'chatSwitch'}
				size={'h36px_w95px'}>
				Channels
			</Button>
			<Button 
				onClick={() => handleSetIsChan(false)}
				className="bg-[#6265A9] hover:text-xl text-white"
				variant={'chatSwitch'}
				size={'h36px_w95px'}>
				Friends
			</Button>
		</div>
	);
}
