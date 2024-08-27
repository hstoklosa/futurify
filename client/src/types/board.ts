import { z } from "zod";

export const createBoardInputSchema = z.object({
  name: z.string().min(1, { message: "Board name is required." }),
});

export type BoardInput = z.infer<typeof createBoardInputSchema>;
