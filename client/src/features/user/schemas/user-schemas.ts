import { z } from "zod";

// Define the form values type
export type UserFormValues = {
  firstName?: string;
  lastName?: string;
  password?: string;
  passwordConfirmation?: string;
  dailyApplicationGoal?: number;
};

export const userDetailsSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no whitespace"
      )
      .optional()
      .or(z.literal("")),
    passwordConfirmation: z.string().optional().or(z.literal("")),
    dailyApplicationGoal: z
      .number()
      .min(0, "Daily application goal must be a non-negative number")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.passwordConfirmation) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    }
  );
