import { z } from "zod";

export const createFieldInputModel =
z.object({

  formId:
  z.string()
  .uuid(),

  label:
  z.string(),

  type:
  z.enum([

  "TEXT",

  "TEXTAREA",

  "EMAIL",

  "NUMBER",

  "SELECT",

  "CHECKBOX",

  "RADIO",

  "DATE",

  "PASSWORD",

  "RATING"

  ]),

  placeholder:
  z.string()
  .optional(),

  options:
  z.string()
  .optional(),

  description:
  z.string()
  .optional(),

  isRequired:
  z.boolean()
  .optional()

});

export const createFieldOutputModel =
z.object({

  id:
  z.string(),

  labelKey:
  z.string(),

  index:
  z.number(),

});

export type CreateFieldInputType =
z.infer<
typeof createFieldInputModel
>;

export type CreateFieldOutputType =
z.infer<
typeof createFieldOutputModel
>;