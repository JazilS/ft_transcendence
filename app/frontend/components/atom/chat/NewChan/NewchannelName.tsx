import { press_Start_2P, quantico } from "@/models/Font/FontModel";

export default function NewChanName({
  channelName,
  setChannelName,
}: {
  channelName: string;
  setChannelName: (value: string) => void;
}) {
  return (
    <>
      <h1 className={`text-sm text-left ${press_Start_2P.className}`}>
        Chose a channel name :
      </h1>
      <input
        className=" w-[80%] ml-8 mt-3 mb-5 h-8 p-2 rounded-3xl text-lg bg-indigo-200  bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg placeholder:text-opacity-50 indent-2"
        placeholder="Channel Name"
        maxLength={12}
        onChange={(event) => setChannelName(event.target.value)}
      ></input>
    </>
  );
}
