import { z } from "zod";

export const createFormInput =
z.object({

title:
z.string()
.max(55)
.describe(
"Title of the form"
),

description:
z.string()
.max(300)
.optional()
.describe(
"Description of the form"
),

createdBy:
z.string()
.uuid()
.describe(
"UUID of the user creating the form"
),

});

export type CreatorFormInputType=
z.infer<
typeof createFormInput
>;

export const listFormByUserIdInput=
z.object({

userId:
z.string()
.uuid()
.describe(
"UUID of the user"
)

});

export type ListFormsByUserIdInputType=
z.infer<
typeof listFormByUserIdInput
>;

export const updateFormInput=
z.object({

formId:
z.string()
.uuid(),

isPublished:
z.boolean()
.optional(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])
.optional(),

});

export type UpdateFormInputType=
z.infer<
typeof updateFormInput
>;

export const getFormInputModel=
z.object({

formId:
z.string()
.uuid()

});

export const getFormOutputModel=
z.object({

id:
z.string(),

title:
z.string(),

description:
z.string().nullable(),

isPublished:
z.boolean(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])

});