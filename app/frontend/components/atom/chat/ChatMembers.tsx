import { useEffect, useState } from "react";
import FadeMenu from "../../molecules/FadeMenu";
import { useGetUserNameByIdMutation } from "@/app/store/features/User/user.api.slice";

export default function ChatMembers({
  members,
}: {
  members: string[] | undefined;
}) {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [getUserNameById] = useGetUserNameByIdMutation();

  useEffect(() => {
    const fetchUserNames = async () => {
      if (members) {
        const names = await Promise.all(
          members.map(async (id) => {
            const response = await getUserNameById({ userId: id });
            console.log("response", response);
            if (typeof response === "string") {
              return response;
            } else if ("data" in response) {
              return response.data;
            }
            return "default"; // or some default value
          })
        );
        console.log("names", names);
        setUserNames(names as string[]);
      }
    };

//TODO : fix this

    fetchUserNames();
  }, [getUserNameById, members]);

  return (
    <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
      <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%]">Chat Members</h1>
      <ul>
        {userNames?.map((member, index) => (
          <li key={index}>
            <FadeMenu value={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}
