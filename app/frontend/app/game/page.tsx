import MyHeader from "@/components/organism/Header";
import '../styles.css'
import './styles.css'
import Button from "@/components/atom/Button";
import Link from "next/link";

export default function GamePage() {
	return (
	<div className="h-[100vh] flex items-center justify-center">
			<div className="h-[70.5%] w-[60%] bg-black rounded-3xl p-10 flex">
				<div className="h-[100%] w-[100%] flex flex-col justify-between ">
					<div className="bg-white h-[2%] w-[100%]"/>
					<div id="userpaddle"></div>
					<div className="bg-white h-[2%] w-[100%]"/>
				</div>
			</div>
	</div>
	);
}