"use client";

import { useState } from "react";
import {
useParams,
useRouter
}
from "next/navigation";

import {
useListFields
}
from "~/hooks/api/form-field";

import {
useSubmitForm
}
from "~/hooks/api/form-submission";

import {
useGetForm
}
from "~/hooks/api/form";

type FormField={

id:string;

label:string;

labelKey:string;

type:string;

options?:string;

isRequired:boolean;

};

export default function PublicFormPage(){

const params=
useParams();

const formId=
params.id as string;

const router=
useRouter();

const[
responses,
setResponses
]=useState<
Record<string,any>
>({});

const{
fields=[],
isLoading
}=
useListFields(
formId
);

const{
form,
isLoading:
formLoading
}=
useGetForm(
formId
);

const{
submitFormAsync,
isPending
}=
useSubmitForm();

const getOptions=(
options?:string
)=>{

try{

return options
?

JSON.parse(
options
)

:

[];

}

catch{

return [];

}

};

if(
formLoading
){

return(

<div
className="
min-h-screen
flex
items-center
justify-center"
>

Loading Form...

</div>

);

}

if(
form &&
!form.isPublished
){

return(

<div
className="
min-h-screen
flex
justify-center
items-center"
>

<div
className="
bg-white
rounded-xl
shadow
p-10"
>

<h1
className="
text-2xl
font-bold"
>

Form unavailable

</h1>

<p
className="
text-gray-500
mt-2"
>

This form is not published

</p>

</div>

</div>

);

}

const handleSubmit=
async()=>{

for(
const field of fields as FormField[]
){

const value=

responses[
field.labelKey
];

if(

field.isRequired &&

(
!value ||
value==="" ||
value==="[]"
)

){

alert(
`${field.label} is required`
);

return;

}

}

try{

await submitFormAsync({

formId,

responseData:
responses

});

setResponses({});

router.push(
"/thank-you"
);

}

catch(error){

alert(
"Submission failed"
);

console.log(
error
);

}

};

return(

<div
className="
min-h-screen
bg-slate-100
p-10"
>

<div
className="
max-w-3xl
mx-auto
bg-white
rounded-2xl
shadow-lg
p-8"
>

<h1
className="
text-3xl
font-bold"
>

{

form?.title ||

"Public Form"

}

</h1>

<p
className="
text-gray-500
mb-8
mt-2"
>

{

form?.description

}

</p>

{

isLoading

?

<p>

Loading fields...

</p>

:

<div
className="
space-y-6"
>

{

(fields as FormField[])

.map(
(field)=>(

<div
key={field.id}
className="
space-y-2"
>

<label
className="
font-medium"
>

{field.label}

{

field.isRequired && (

<span
className="
text-red-500
ml-1"
>

*

</span>

)

}

</label>

{

field.type==="TEXTAREA"

?

<textarea

className="
w-full
border
rounded-lg
p-3"

value={

responses[
field.labelKey
] || ""

}

placeholder={`Enter ${field.label}`}

onChange={(e)=>{

setResponses(
prev=>({

...prev,

[field.labelKey]:
e.target.value

})

);

}}

/>

:

field.type==="SELECT"

?

<select

className="
w-full
border
rounded-lg
p-3"

value={

responses[
field.labelKey
] || ""

}

onChange={(e)=>{

setResponses(
prev=>({

...prev,

[field.labelKey]:
e.target.value

})

);

}}

>

<option value="">

Choose option

</option>

{

getOptions(
field.options
)

.map(
(option:string)=>(

<option
key={option}
value={option}
>

{option}

</option>

)

)

}

</select>

:

field.type==="RADIO"

?

<div
className="
space-y-2"
>

{

getOptions(
field.options
)

.map(
(option:string)=>(

<div
key={option}
className="
flex
gap-2"
>

<input

type="radio"

name={
field.id
}

checked={

responses[
field.labelKey
]===option

}

onChange={()=>{

setResponses(
prev=>({

...prev,

[field.labelKey]:
option

})

);

}}

/>

<label>

{option}

</label>

</div>

)

)

}

</div>

:

field.type==="CHECKBOX"

?

<div
className="
space-y-2"
>

{

getOptions(
field.options
)

.map(
(option:string)=>(

<div
key={option}
className="
flex
gap-2"
>

<input

type="checkbox"

checked={

responses[
field.labelKey
]

?

JSON.parse(
responses[
field.labelKey
] || "[]"
)

.includes(
option
)

:

false

}

onChange={(e)=>{

const current=

responses[
field.labelKey
]

?

JSON.parse(
responses[
field.labelKey
] || "[]"
)

:

[];

const updated=

e.target.checked

?

[
...current,
option
]

:

current.filter(
(item:string)=>
item!==option
);

setResponses(
prev=>({

...prev,

[field.labelKey]:
JSON.stringify(
updated
)

})

);

}}

/>

<label>

{option}

</label>

</div>

)

)

}

</div>

:

<input

type={

field.type==="EMAIL"

?

"email"

:

field.type==="NUMBER"

?

"number"

:

"text"

}

className="
w-full
border
rounded-lg
p-3"

value={

responses[
field.labelKey
] || ""

}

placeholder={`Enter ${field.label}`}

onChange={(e)=>{

setResponses(
prev=>({

...prev,

[field.labelKey]:
e.target.value

})

);

}}

/>

}

</div>

)

)

}

<button

className="
bg-black
text-white
w-full
rounded-lg
p-3"

disabled={
isPending
}

onClick={
handleSubmit
}

>

{

isPending

?

"Submitting..."

:

"Submit Form"

}

</button>

</div>

}

</div>

</div>

);

}