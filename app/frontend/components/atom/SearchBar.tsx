import { press_Start_2P } from "@/models/Font/FontModel";

export default function SearchBar() {
  return (
    <form className="w-[55%] ml-32">
      <div className={`${press_Start_2P.className}`}>
        <input
          type="search"
          placeholder="search"
          className="h-[44px] p-4 rounded-lg  bg-white placeholder-indigo-500 text-black text-center text-xl"
        />
      </div>
    </form>
  );
}
