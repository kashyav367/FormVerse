import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  listFormOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
  getFormInputModel,
  getFormOutputModel,
  publicFormsOutputModel
}
from "./model";

import { formService } from "../../services";

import z from "zod";

const TAGS=["Forms"];

const getPath=
generatePath(
"/form"
);

export const formRouter=
router({

createForm:

authenticatedProcedure

.meta({

openapi:{

method:"POST",

path:getPath(
"/createForm"
),

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

const{
title,
description
}=input;

const {id}=

await formService
.createForm({

title,

description,

createdBy:
ctx.user.id

});

return{

id

};

}
),

listForm:

authenticatedProcedure

.meta({

openapi:{

method:"GET",

path:getPath(
"/listForm"
),

tags:TAGS,

protect:true

}

})

.input(
z.undefined()
)

.output(
listFormOutputModel
)

.query(
async({ctx})=>{

return await
formService
.listFormByUserId({

userId:
ctx.user.id

});

}
),

deleteForm:

authenticatedProcedure

.meta({

openapi:{

method:"DELETE",

path:getPath(
"/deleteForm"
),

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
async({
input
})=>{

return await
formService
.deleteForm({

formId:
input.formId

});

}
),

updateForm:

authenticatedProcedure

.meta({

openapi:{

method:"PATCH",

path:getPath(
"/updateForm"
),

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
async({
input
})=>{

return await
formService
.updateForm(
input
);

}
),

getForm:

authenticatedProcedure

.meta({

openapi:{

method:"GET",

path:getPath(
"/getForm"
),

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
async({
input
})=>{

return await
formService
.getFormById(
input.formId
);

}
),

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
)

});

