import db from "@repo/database";

import {
eq,
and,
ilike
} from "drizzle-orm";

import {
formTable
}
from "@repo/database/models/form";

import {
formsFields
}
from "@repo/database/models/form-field";

import { formSubmissions } from "@repo/database/models/form-submission";

import {

createFormInput,
CreatorFormInputType,

duplicateFormInput,
DuplicateFormInputType

}
from "./model";

class FormService{

/* ---------------- CREATE ---------------- */

public async createForm(
payload:CreatorFormInputType
){

const{

title,
description,
createdBy,

theme,
template,
visibility,
category,
icon

}=await createFormInput.parseAsync(
payload
);

const [result]=

await db

.insert(
formTable
)

.values({

title,

description,

createdBy,

isPublished:false,

visibility:
visibility
||
"UNLISTED",

theme:
theme
||
"Aurora",

template:
template
||
"BLANK",

category:
category
||
"Feedback",

icon:
icon
||
"📝"

})

.returning({

id:
formTable.id

});

if(!result){

throw new Error(
"Something went wrong while creating form"
);

}

return{

id:
result.id

};

}


/* ---------------- DELETE ---------------- */

public async deleteForm(
{
formId
}:{
formId:string
}
){

const [result]=

await db

.delete(
formTable
)

.where(
eq(
formTable.id,
formId
)
)

.returning({

id:
formTable.id

});

if(!result){

throw new Error(
"Form not found"
);

}

return result;

}


/* ---------------- UPDATE ---------------- */

public async updateForm(
payload:{

formId:string;

isPublished?:boolean;

visibility?:
"PUBLIC"|
"UNLISTED";

}
){

const [result]=

await db

.update(
formTable
)

.set({

...(payload.isPublished!==undefined&&{

isPublished:
payload.isPublished

}),

...(payload.visibility&&{

visibility:
payload.visibility

})

})

.where(

eq(
formTable.id,
payload.formId
)

)

.returning({

id:
formTable.id,

isPublished:
formTable.isPublished,

visibility:
formTable.visibility

});

if(!result){

throw new Error(
"Form not found"
);

}

return result;

}


/* ---------------- GET ---------------- */

public async getFormById(
formId:string
){

const [form]=

await db

.select()

.from(
formTable
)

.where(
eq(
formTable.id,
formId
)
);

if(!form){

throw new Error(
"Form not found"
);

}

return form;

}


/* ---------------- PUBLIC ---------------- */


public async getPublicForms(){

return await db

.select({

id:
formTable.id,

title:
formTable.title,

description:
formTable.description,

theme:
formTable.theme,

template:
formTable.template,

category:
formTable.category,

icon:
formTable.icon

})

.from(
formTable
)

.where(

eq(
formTable.visibility,
"PUBLIC"
)

);

}


/* ---------------- DUPLICATE ---------------- */

public async duplicateForm(
payload:DuplicateFormInputType
){

const{
formId,
createdBy
}=await duplicateFormInput.parseAsync(
payload
);

const original=

await db

.select()

.from(
formTable
)

.where(
eq(
formTable.id,
formId
)
)

.then(
rows=>rows[0]
);

if(!original){

throw new Error(
"Form not found"
);

}

const [newForm] =

await db

.insert(
formTable
)

.values({

title:
`${original.title} Copy`,

description:
original.description,

createdBy,

isPublished:false,

visibility:"UNLISTED",

theme:
original.theme,

template:
original.template,

category:
original.category,

icon:
original.icon

})

.returning({

id:
formTable.id

});

if(!newForm){

throw new Error(
"Failed to duplicate form"
);

}

const fields=

await db

.select()

.from(
formsFields
)

.where(
eq(
formsFields.formId,
formId
)
);

if(fields.length){

await db

.insert(
formsFields
)

.values(

fields.map(
(field,index)=>({

formId:
newForm.id,

label:
field.label,

labelKey:
field.labelKey,

type:
field.type,

options:
field.options,

index,

placeholder:
field.placeholder,

isRequired:
field.isRequired

}))

);

}

return{

id:
newForm.id

};

}

/* ---------------- LIST FORMS ---------------- */

public async listFormByUserId(
payload:{
userId:string;
search?:string;
visibility?:
"PUBLIC"|
"UNLISTED";
isPublished?:
boolean;
}
){

const{
userId,
search,
visibility,
isPublished
}=payload;

const forms=

await db

.select({

id:
formTable.id,

title:
formTable.title,

description:
formTable.description,

createdAt:
formTable.createdAt,

updatedAt:
formTable.updatedAt,

isPublished:
formTable.isPublished,

visibility:
formTable.visibility,

theme:
formTable.theme,

template:
formTable.template,

category:
formTable.category,

icon:
formTable.icon

})

.from(
formTable
)

.where(

and(

eq(
formTable.createdBy,
userId
),

search
?
ilike(
formTable.title,
`%${search}%`
)
:
undefined,

visibility
?
eq(
formTable.visibility,
visibility
)
:
undefined,

isPublished!==undefined
?
eq(
formTable.isPublished,
isPublished
)
:
undefined

)

);

const formsWithResponses=

await Promise.all(

forms.map(
async(form)=>{

const submissions=

await db

.select()

.from(
formSubmissions
)

.where(
eq(
formSubmissions.formId,
form.id
)
);

return{

...form,

responseCount:
submissions.length

};

}

)

);

return formsWithResponses;

}


/* ---------------- DASHBOARD ---------------- */

public async getDashboardStats(
userId:string
){

const forms=

await db

.select()

.from(
formTable
)

.where(
eq(
formTable.createdBy,
userId
)
);

let totalResponses=0;

for(const form of forms){

const submissions=

await db

.select()

.from(
formSubmissions
)

.where(
eq(
formSubmissions.formId,
form.id
)
);

totalResponses+=
submissions.length;

}

return{

totalForms:
forms.length,

publishedForms:
forms.filter(
f=>f.isPublished
).length,

unlistedForms:
forms.filter(
f=>f.visibility==="UNLISTED"
).length,

totalResponses

};

}
}

export default new FormService();