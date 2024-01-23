
import { Press_Start_2P } from 'next/font/google'
import { Quantico } from 'next/font/google'
import Link from 'next/link'
 
const press_Start_2P = Press_Start_2P({
	subsets: ['latin'],
	weight: '400'
})

const quantico = Quantico({
	subsets: ['latin'],
	weight: '400'
})

const LogPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-evenly">
			<div className={` text-black text-7xl ${press_Start_2P.className}`}>PONG</div>
			<Link href="/HomePage">
				<button className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}>
					Login with 42
				</button >
			</Link>
		</div>
	);
}

const LogPageLayout: React.FC = () => {
	return (
		<div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
			<div  className="bg-black h-[8vh] flex items-center ">
				<span className={`items-center bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent text-2xl pl-48 ${press_Start_2P.className}`}>
					FT_TRANSCENDENCE
				</span>
			</div>
			<div className="h-[100%] flex pb-20 justify-evenly">
				<LogPage></LogPage>
			</div>
		</div>
	);
};

export default LogPageLayout;