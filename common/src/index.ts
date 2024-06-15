import z from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().optional(),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const createBlogPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

// Above are variables used be backend
// Below are variables used by frontend
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
