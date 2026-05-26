import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(100, "Ім'я занадто довге"),
  email: z.string().email("Невірний формат email"),
  password: z
    .string()
    .min(6, "Пароль повинен містити мінімум 6 символів")
    .max(100, "Пароль занадто довгий"),
  role: z.enum(["SEEKER", "EMPLOYER"], {
    errorMap: () => ({ message: "Оберіть роль" }),
  }),
});

export const signInSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(1, "Введіть пароль"),
});

export const jobSchema = z.object({
  title: z
    .string()
    .min(3, "Назва повинна містити мінімум 3 символи")
    .max(200, "Назва занадто довга"),
  description: z
    .string()
    .min(20, "Опис повинен містити мінімум 20 символів"),
  company: z.string().min(2, "Введіть назву компанії"),
  location: z.string().min(2, "Введіть місцезнаходження"),
  salary: z.string().optional(),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"]),
  categoryId: z.string().optional().nullable(),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
});

export const applicationSchema = z.object({
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url("Невірний URL").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  bio: z.string().max(1000).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  resumeUrl: z.string().url().optional().nullable().or(z.literal("")),
  portfolioUrl: z.string().url().optional().nullable().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  experience: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  companyName: z.string().max(200).optional().nullable(),
  companyDescription: z.string().max(2000).optional().nullable(),
  companyWebsite: z.string().url().optional().nullable().or(z.literal("")),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
