import { z } from "zod";

export const fullNameValidation = z
  .string()
  .min(2, "Full Name must have atleast 2 characters")
  .max(20, "Full Name can have maximum 20 characters")
  .regex(/^[a-zA-Z0-9_ ]+$/, "Full Name can not have special characters")
  
export const passwordValidation = z
  .string()
  .min(2, "Password must have atleast 2 characters")
  .max(20, "Password can have maximum 20 characters");

export const signUpSchema = z.object({
  email: z.string().email({message: "Invalid email address"}),
  fullName: fullNameValidation,
  password: passwordValidation,
});
