import { z } from "zod";

// Password validation regex pattern
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

// Sign In Schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Sign Up Schema
export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name must be at most 30 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name must be at most 30 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Email is invalid"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
