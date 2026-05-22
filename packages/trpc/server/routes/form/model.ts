import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(55),
  description: z.string().max(300).optional(),

  // remove uuid validation
  createdBy: z.string(),
});

export type CreatorFormInputType =
  z.infer<typeof createFormInput>;

export const listFormByUserIdInput = z.object({
  // remove uuid validation
  userId: z.string(),
});

export type ListFormsByUserIdInputType =
  z.infer<typeof listFormByUserIdInput>;

export const createFormInputModel = z.object({
  title: z.string().max(55),
  description: z.string().max(300).optional(),
});

export const createFormOutputModel = z.object({
  id: z.string(),
});

export const listFormOutputModel = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
);