import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import z from "zod";

import {

createFormInputModel,
createFormOutputModel,

listFormOutputModel,
listFormInputModel,

updateFormInputModel,
updateFormOutputModel,

getFormInputModel,
getFormOutputModel,

publicFormsOutputModel,

duplicateFormInputModel,
duplicateFormOutputModel,

dashboardStatsOutputModel

} from "./model";

const TAGS=["Forms"];

const getPath=
generatePath("/form");

export const formRouter=
router({

/* ---------------- CREATE ---------------- */

createForm:

authenticatedProcedure

.meta({

openapi:{

method:"POST",
path:getPath("/createForm"),
tags:TAGS,
protect:true

}

})

.input(
createFormInputModel
)

.output(
createFormOutputModel
)

.mutation(
async({
input,
ctx
})=>{

const{id}=

await formService
.createForm({

title:
input.title,

description:
input.description,

theme:
input.theme,

template:
input.template,

visibility:
input.visibility,

category:
input.category,

icon:
input.icon,

createdBy:
ctx.user.id

});

return{

id

};

}
),


/* ---------------- LIST ---------------- */

listForm:

authenticatedProcedure

.meta({

openapi:{

method:"GET",
path:getPath("/listForm"),
tags:TAGS,
protect:true

}

})

.input(
listFormInputModel
)

.output(
listFormOutputModel
)

.query(
async({
ctx,
input
})=>{

return await
formService
.listFormByUserId({

userId:
ctx.user.id,

search:
input?.search,

visibility:
input?.visibility,

isPublished:
input?.isPublished

});

}
),


/* ---------------- DELETE ---------------- */

deleteForm:

authenticatedProcedure

.meta({

openapi:{

method:"DELETE",
path:getPath("/deleteForm"),
tags:TAGS,
protect:true

}

})

.input(

z.object({

formId:
z.string()
.uuid()

})

)

.output(

z.object({

id:
z.string()

})

)

.mutation(
async({input})=>{

return await
formService
.deleteForm({

formId:
input.formId

});

}
),


/* ---------------- UPDATE ---------------- */

updateForm:

authenticatedProcedure

.meta({

openapi:{

method:"PATCH",
path:getPath("/updateForm"),
tags:TAGS,
protect:true

}

})

.input(
updateFormInputModel
)

.output(
updateFormOutputModel
)

.mutation(
async({input})=>{

return await
formService
.updateForm(
input
);

}
),


/* ---------------- GET SINGLE ---------------- */

getForm:

authenticatedProcedure

.meta({

openapi:{

method:"GET",
path:getPath("/getForm"),
tags:TAGS,
protect:true

}

})

.input(
getFormInputModel
)

.output(
getFormOutputModel
)

.query(
async({input})=>{

return await
formService
.getFormById(
input.formId
);

}
),


/* ---------------- PUBLIC ---------------- */

listPublicForms:

authenticatedProcedure

.output(
publicFormsOutputModel
)

.query(
async()=>{

return await
formService
.getPublicForms();

}
),


/* ---------------- DUPLICATE ---------------- */

duplicateForm:

authenticatedProcedure

.meta({

openapi:{

method:"POST",

path:getPath(
"/duplicateForm"
),

tags:TAGS,

protect:true

}

})

.input(
duplicateFormInputModel
)

.output(
duplicateFormOutputModel
)

.mutation(
async({
input,
ctx
})=>{

return await
formService
.duplicateForm({

formId:
input.formId,

createdBy:
ctx.user.id

});

}
),


/* ---------------- DASHBOARD STATS ---------------- */

dashboardStats:

authenticatedProcedure

.meta({

openapi:{

method:"GET",

path:getPath(
"/dashboardStats"
),

tags:TAGS,

protect:true

}

})

.output(
dashboardStatsOutputModel
)

.query(
async({
ctx
})=>{

return await
formService
.getDashboardStats(
ctx.user.id
);

}
)

});