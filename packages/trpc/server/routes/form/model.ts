import { z } from "zod";

export const createFormInputModel=
z.object({

title:
z.string()
.min(
1,
"Title required"
)
.max(55)
.describe(
"Form title"
),

description:
z.string()
.max(300)
.optional()
.describe(
"Form description"
),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])
.optional(),

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

category:
z.string()
.optional()
.describe(
"Form category"
),

icon:
z.string()
.optional()
.describe(
"Form icon"
)

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
]),

theme:
z.string()
.nullable()
.optional(),

template:
z.string()
.nullable()
.optional(),

category:
z.string()
.nullable()
.optional(),

icon:
z.string()
.nullable()
.optional()

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
]),

theme:
z.string()
.nullable()
.optional(),

template:
z.string()
.nullable()
.optional(),

category:
z.string()
.nullable()
.optional(),

icon:
z.string()
.nullable()
.optional()

})

);

export const publicFormsOutputModel=
z.array(

z.object({

id:z.string(),

title:z.string(),

description:
z.string().nullable(),

theme:
z.string().optional(),

template:
z.string().optional(),

category:
z.string().optional(),

icon:
z.string().optional()

})

);


export const duplicateFormInputModel=
z.object({

formId:
z.string()

.uuid()

.describe(
"ID of form to duplicate"
)

});


export const duplicateFormOutputModel=
z.object({

id:
z.string()

.describe(
"Duplicated form ID"
)

});


/* Dashboard */

export const listFormInputModel=
z.object({

search:
z.string()
.optional(),

visibility:
z.enum([
"PUBLIC",
"UNLISTED"
])
.optional(),

isPublished:
z.boolean()
.optional()

});


export const dashboardStatsOutputModel=
z.object({

totalForms:
z.number(),

publishedForms:
z.number(),

unlistedForms:
z.number(),

totalResponses:
z.number()

});


export const recentActivityOutputModel=
z.array(

z.object({

id:
z.string(),

action:
z.string(),

createdAt:
z.date()

})

);