import { z } from "zod";

/* ---------------- CREATE ---------------- */

export const createFormInput=
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

theme:
z.string()
.optional()
.describe(
"Selected theme"
),

template:
z.string()
.optional()
.describe(
"Selected template"
),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])
.optional(),

category:
z.string()
.optional()
.describe(
"Selected category"
),

icon:
z.string()
.optional()
.describe(
"Selected icon"
)

});

export type CreatorFormInputType=
z.infer<
typeof createFormInput
>;


/* ---------------- LIST ---------------- */

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


/* ---------------- UPDATE ---------------- */

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


/* ---------------- GET ---------------- */

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
z.string()
.nullable(),

isPublished:
z.boolean(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
]),

theme:
z.string()
.optional(),

template:
z.string()
.optional(),

category:
z.string()
.optional(),

icon:
z.string()
.optional()

});


/* ---------------- DUPLICATE ---------------- */

export const duplicateFormInput=
z.object({

formId:
z.string()
.uuid()
.describe(
"UUID of form to duplicate"
),

createdBy:
z.string()
.uuid()
.describe(
"UUID of current user"
)

});

export type DuplicateFormInputType=
z.infer<
typeof duplicateFormInput
>;