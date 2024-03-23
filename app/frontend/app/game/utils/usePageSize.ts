import { useWindowSize } from "usehooks-ts";
// import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from "../../utils/constant";

export const SIDEBAR_WIDTH = 100;
export const NAVBAR_HEIGHT = 52;
export const CHATBAR_WIDTH = 400;

const usePageSize = () => {
  const { width, height } = useWindowSize();
  if (width < 900) return { width, height: height - NAVBAR_HEIGHT };

  return { width: width - SIDEBAR_WIDTH, height };
};

export default usePageSize;