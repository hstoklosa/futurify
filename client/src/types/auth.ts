import { z } from "zod";

export const registerInputSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email was provided." }),
    password: z
        .string()
        .min(3)
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
