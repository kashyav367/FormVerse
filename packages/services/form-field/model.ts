import { z } from "zod";

const fieldTypeEnum =
z.enum([

"TEXT",

"TEXTAREA",

"NUMBER",

"EMAIL",

"CHECKBOX",

"SELECT",

"DATE",

"PASSWORD",

]);

export const createFieldInput =
z.object({

  label:
  z
  .string()
  .max(100)
  .describe(

    "Display label for field"

  ),

  type:
  fieldTypeEnum
  .describe(

    "Field type"

  ),

  formId:
  z
  .string()
  .uuid()
  .describe(

    "Form UUID"

  ),

  placeholder:
  z
  .string()
  .optional()
  .describe(

    "Placeholder text"

  ),

  isRequired:
  z
  .boolean()
  .optional()
  .default(false)
  .describe(

    "Required field"

  ),

  options:
  z
  .string()
  .optional()
  .describe(

    "JSON string for select/checkbox options"

  ),

});

export type CreateFieldInputType =
z.infer<
typeof createFieldInput
>;

export const updateFieldInput =
z.object({

  fieldId:
  z
  .string()
  .uuid(),

  label:
  z
  .string()
  .max(100)
  .optional(),

  type:
  fieldTypeEnum
  .optional(),

  placeholder:
  z
  .string()
  .optional()
  .nullable(),

  isRequired:
  z
  .boolean()
  .optional(),

  options:
  z
  .string()
  .optional(),

});

export type UpdateFieldInputType =
z.infer<
typeof updateFieldInput
>;

export const deleteFieldInput =
z.object({

  fieldId:
  z
  .string()
  .uuid(),

});

export type DeleteFieldInputType =
z.infer<
typeof deleteFieldInput
>;

export const getFieldInputType =
z.object({

  formId:
  z
  .string()
  .uuid(),

});

export type GetFieldInputType =
z.infer<
typeof getFieldInputType
>;