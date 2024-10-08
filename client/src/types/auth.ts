import { z } from "zod";

export const registerInputSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email was provided." }),
  password: z
    .string()
    .min(8, { message: "Passwords must be 8 characters or more." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must include at least one number.",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Password must include at least one special character.",
    }),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const verificationSchema = z.object({
  otp: z.string().length(6),
});

export type VerificationInput = z.infer<typeof verificationSchema>;

export const loginInputSchema = z.object({
  email: z.string().email({ message: "Invalid email was provided." }),
  password: z
    .string()
    .min(8)
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must include at least one number.",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Password must include at least one special character.",
    }),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
