import { quantico } from "@/models/Font/FontModel";

export default function TextInput({
  setText,
  nameOrPass,
}: {
  setText: (value: string) => void;
  nameOrPass: string;
}) {
  return (
    <>
      <h1 className={`text-xl text-left ${quantico.className}`}>
        Chose a {nameOrPass} :
      </h1>
      <input
        className=" w-[80%] ml-8 mt-3 mb-5 h-8 p-2 rounded-3xl text-lg bg-indigo-200  bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg placeholder:text-opacity-50 indent-2"
        placeholder={nameOrPass}
        maxLength={15}
        onChange={(event) => setText(event.target.value)}
      ></input>
    </>
  );
}
