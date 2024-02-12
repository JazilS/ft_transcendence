import Image from 'next/image';
import '../app/styles.css';

const GameImage: React.FC = () => {
	return (
	<div className=" flex flex-col justify-center items-center rounded-3xl h-[90vh] ">
		<div>
			<Image
			src="/pongscreen.png" 
			alt="Pong"
			layout="responsive"
			width={1200}
			height={658}
			className="rounded-3xl drop-shadow-2xl"/>
		</div>
	</div>
	);
}

export default GameImage