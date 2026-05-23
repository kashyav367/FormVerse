import { z } from "zod";

export const createFormInputModel=
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

});

export const createFormOutputModel=
z.object({

id:
z.string()

});

export const updateFormInputModel=
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

export const updateFormOutputModel=
z.object({

id:
z.string(),

isPublished:
z.boolean(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])

});

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
])

});

export const listFormOutputModel=
z.array(

z.object({

id:
z.string(),

title:
z.string(),

description:
z.string()
.nullable(),

createdAt:
z.date()
.nullable(),

updatedAt:
z.date()
.nullable(),

isPublished:
z.boolean(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])

})

);

export const publicFormsOutputModel=
z.array(

z.object({

id:
z.string(),

title:
z.string(),

description:
z.string()
.nullable()

})

);