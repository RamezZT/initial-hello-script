
import * as z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Charity name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  confirmPassword: z.string(),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must include country code (e.g. +1234567890)"),
  lat: z.string().min(1, "Latitude is required"),
  lng: z.string().min(1, "Longitude is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
