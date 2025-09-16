import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3).max(250).trim(),
  email: z.email().max(250).toLowerCase().trim(),
  password: z.string().min(6).max(250).trim(),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

export const loginSchema = z.object({
  email: z.email().max(250).toLowerCase().trim(),
  password: z.string().min(6).max(250).trim(),
});
