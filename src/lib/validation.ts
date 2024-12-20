import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const translationSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  from_lang: z.string().min(2, 'Source language is required'),
  to_lang: z.string().min(2, 'Target language is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TranslationInput = z.infer<typeof translationSchema>;