import { z } from "zod";

// Define the form values type
export type ContactFormValues = {
  title: string;
  message: string;
};

export const contactSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});
