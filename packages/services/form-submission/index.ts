import db,{
eq
} from "@repo/database";

import {
formSubmissions
} from "@repo/database/models/form-submission";

import {
createSubmissionInput,
CreateSubmissionInputType
} from "./model";

class FormSubmissionService{

public async createSubmission(
payload:CreateSubmissionInputType
){

const{
formId,
responseData
}=
await createSubmissionInput
.parseAsync(payload);

const [result]=
await db
.insert(
formSubmissions
)
.values({

formId,

responseData:
JSON.stringify(
responseData
)

})
.returning({

id:
formSubmissions.id

});

if(!result){

throw new Error(
"Submission failed"
);

}

return{

id:
result.id

};

}

public async getSubmissions(
formId:string
){

const data=

await db
.select({

id:
formSubmissions.id,

formId:
formSubmissions.formId,

responseData:
formSubmissions.responseData,

submittedAt:
formSubmissions.submittedAt

})
.from(
formSubmissions
)
.where(
eq(
formSubmissions.formId,
formId
)
);

return data.map(
(item)=>{

let parsed={};

try{

parsed=
JSON.parse(
item.responseData
);

}catch{

parsed={};

}

return{

...item,

responseData:
parsed

};

});

}

}

export default
new FormSubmissionService();