import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const SignUpSchema = z
  .object({
    email: requiredString.email("Invalid Email Address"),
    username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed",
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
    confirm: requiredString,
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const SignInSchema = z.object({
  email: requiredString,
  password: requiredString,
});

export const CreatePostSchema = z.object({
  content: requiredString,
});

export type SignUpValues = z.infer<typeof SignUpSchema>;
export type SignInValues = z.infer<typeof SignInSchema>;
export type CreatePostValues = z.infer<typeof CreatePostSchema>;
