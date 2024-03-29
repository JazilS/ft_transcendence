import { pongType } from "@/shared/constant";
import { z } from "zod";
import { BaseSchema } from "./BaseType";

export const PongSchema = z.object({
  victory: z.number().nonnegative(),
  losses: z.number().nonnegative(),
  rating: z.number().nonnegative(),
});

<<<<<<< HEAD
export interface Game {
	id: string | undefined;
	user: User | undefined;
	opponent: User | undefined;
	// a modifier
}
=======
export type PongType = z.infer<typeof PongSchema>;

export const PongGameTypeSchema = z.object({ pongType: z.enum(pongType) });

export type PongGameType = z.infer<typeof PongGameTypeSchema>;

export const GameInvitationSchema = BaseSchema.merge(PongGameTypeSchema);

export type GameInvitationType = z.infer<typeof GameInvitationSchema>;
>>>>>>> origin/jazil
