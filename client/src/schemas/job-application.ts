import { z } from "zod";

export enum JobType {
  ON_SITE = "On-Site",
  HYBRID = "Hybrid",
  REMOTE = "Remote",
}

const JobTypeKeys = Object.keys(JobType) as [string, ...string[]];

// as [string, ...string[]] -> an array that has at least one string,
// and then followed by 0 or more other strings (solution for zod).
export const createJobSchema = z.object({
  boardId: z.string().min(1, { message: "Target board is required." }),
  stageId: z.string().min(1, { message: "Target stage is required." }),
  title: z.string().min(1, { message: "Job title is required." }),
  companyName: z.string().min(1, { message: "Company name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  type: z.enum(JobTypeKeys, { message: "A correct job type is required." }),

  description: z.string().optional(),
});

export type createJobInput = z.infer<typeof createJobSchema>;

export const updateJobSchema = z.object({
  stageId: z.string().min(1, { message: "Target stage is required." }),
  title: z.string().min(1, { message: "Job title is required." }),
  companyName: z.string().min(1, { message: "Company name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  type: z.enum(JobTypeKeys, { message: "An incorrect job type was provided." }),
  description: z.string().optional(),
  postUrl: z
    .string()
    .url("An invalid listing URL provided.")
    .optional()
    .or(z.literal("")),
  salary: z.string().optional(),
});

export type updateJobInput = z.infer<typeof updateJobSchema>;
