import FadeMenu from "../../molecules/FadeMenu";

export default function ChatMembers({members}: {members: string[]}) {
	
	return (
		<div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
			<h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%]">Chat Members</h1>
			<ul>
				{members.map((member, index) => (
					<li key={index}>
						<FadeMenu value={member}/>
					</li>
				))}
			</ul>
		</div>
	);
}