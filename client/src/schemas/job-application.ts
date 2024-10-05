import { z } from "zod";

export enum JobType {
  ON_SITE = "ON_SITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

export const createJobSchema = z.object({
  title: z.string().min(1, { message: "Job title is required." }),
  companyName: z.string().min(1, { message: "Company name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  type: z.nativeEnum(JobType),
  description: z.string().optional(),
  boardId: z.string().min(1, { message: "Target board is required." }),
  stageId: z.string().min(1, { message: "Target stage is required." }),
});

export type createJobInput = z.infer<typeof createJobSchema>;
