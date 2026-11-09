import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().optional(),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero"),

  category: z.string().trim().min(1, "Category is required"),

  date: z.coerce.date({
    error: "A valid date is required",
  }),
});


export const updateExpenseSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  amount: z.coerce.number().positive().optional(),
  category: z.string().trim().min(1).optional(),
  date: z.coerce.date().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);