import PlayerProfile from "../User/PlayerProfile/PlayerProfile";
import FadeMenuInfos from "./FadeMenuInfos";

export interface ChatMemberProfile {
  userProfile: PlayerProfile;
  role: string;
  fadeMenuInfos: FadeMenuInfos;
}
