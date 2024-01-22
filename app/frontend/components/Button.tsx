'use client'
 
import {Quantico} from 'next/font/google'

const quantico = Quantico({
	subsets: ['latin'],
	weight: '400'
})

interface ButtonProps {
  children: React.ReactNode;
}

const MyButton: React.FC<ButtonProps> = ({ children }) => {
	function handleClick() {
		alert('clic !');
	}
	return (
		<button
			onClick={handleClick}
			className="pt-1 pb-1 bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-center text-white text-2xl  rounded-2xl cursor-pointer">
			<div className={`ml-8 mr-8 ${quantico.className}`} >{children}
			</div>	
		</button>
	);
};




export default MyButton;