"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
Trash2,
Copy,
Eye,
CheckCircle
} from "lucide-react";

import { useState } from "react";

import {
useCreateField,
useListFields,
useUpdateField,
useDeleteField
}
from "~/hooks/api/form-field";

import {
useUpdateForm,
useGetForm
}
from "~/hooks/api/form";

import {
Button
}
from "~/components/ui/button";

import {
Input
}
from "~/components/ui/input";

type FieldType=
| "TEXT"
| "EMAIL"
| "NUMBER"
| "TEXTAREA"
| "SELECT"
| "CHECKBOX"
| "RADIO";

type Field={

id:string;
label:string;
type:FieldType;
options?:string|null;
isRequired:boolean;

};

export default function BuilderPage(){

const params=
useParams();

const formId=
params.id as string;

const[
copied,
setCopied
]=useState(false);

const{
createFieldAsync
}=
useCreateField();

const{
updateFieldAsync
}=
useUpdateField();

const{
deleteFieldAsync
}=
useDeleteField();

const{
updateFormAsync,
isPending
}=
useUpdateForm();

const{
form,
isLoading:formLoading
}=
useGetForm(
formId
);

const{
fields=[],
isLoading
}=
useListFields(
formId
);

const addField=
async(
type:FieldType,
label:string
)=>{

try{

await createFieldAsync({

formId,
label,
type,
isRequired:false,

options:

(
type==="SELECT" ||
type==="CHECKBOX" ||
type==="RADIO"
)

?

JSON.stringify([
"Option 1",
"Option 2"
])

:

undefined

});

}catch(error){

console.log(
error
);

}

};

const handleDelete=
async(
fieldId:string
)=>{

const confirmed=
confirm(
"Delete field?"
);

if(
!confirmed
)
return;

try{

await deleteFieldAsync({

fieldId

});

}catch(error){

console.log(
error
);

}

};

const copyLink=
async()=>{

try{

await navigator
.clipboard
.writeText(

`${window.location.origin}/form/${formId}`

);

setCopied(
true
);

setTimeout(()=>{

setCopied(
false
);

},2000);

}catch(error){

console.log(
error
);

}

};

const getOptions=(
options?:string|null
)=>{

try{

return options

?

JSON.parse(
options
)

:

[];

}catch{

return[];

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

Loading...

</div>

);

}

return(

<div
className="
min-h-screen
bg-slate-100
p-10"
>

<div
className="
flex
justify-between
items-center
mb-8"
>

<div>

<h1
className="
text-4xl
font-bold"
>

Form Builder

</h1>

<p
className="
text-gray-500"
>

Total Fields:
{" "}
{fields.length}

</p>

{

form?.isPublished

&&

<div
className="
flex
items-center
gap-2
mt-2
text-green-600"
>

<CheckCircle
size={16}
/>

Published

</div>

}

</div>

<div
className="
flex
flex-wrap
gap-3"
>

<Button

disabled={
isPending
}

variant={
form?.isPublished
?
"default"
:
"outline"
}

onClick={async()=>{

await updateFormAsync({

formId,
isPublished:true

});

}}

>

{

isPending

?

"Loading..."

:

"Publish"

}

</Button>

<Button

disabled={
isPending
}

variant={
!form?.isPublished
?
"default"
:
"outline"
}

onClick={async()=>{

await updateFormAsync({

formId,
isPublished:false

});

}}

>

Unpublish

</Button>

<Button

disabled={
isPending
}

variant={
form?.visibility==="PUBLIC"
?
"default"
:
"outline"
}

onClick={async()=>{

await updateFormAsync({

formId,
visibility:"PUBLIC"

});

}}

>

Public

</Button>

<Button

disabled={
isPending
}

variant={
form?.visibility==="UNLISTED"
?
"default"
:
"outline"
}

onClick={async()=>{

await updateFormAsync({

formId,
visibility:"UNLISTED"

});

}}

>

Unlisted

</Button>

<Button
variant="outline"
onClick={copyLink}
>

<Copy
size={16}
className="mr-2"
/>

{

copied

?

"Copied ✓"

:

"Copy Link"

}

</Button>

<Link
href={`/form/${formId}`}
>

<Button>

<Eye
size={16}
className="mr-2"
/>

Preview

</Button>

</Link>

<Link
href={`/responses/${formId}`}
>

<Button
variant="secondary"
>

Responses

</Button>

</Link>

</div>

</div>

<div
className="
flex
flex-wrap
gap-3
mb-10"
>

<Button onClick={()=>addField("TEXT","Name")}>
+ Text
</Button>

<Button onClick={()=>addField("EMAIL","Email")}>
+ Email
</Button>

<Button onClick={()=>addField("NUMBER","Phone")}>
+ Number
</Button>

<Button onClick={()=>addField("TEXTAREA","Description")}>
+ TextArea
</Button>

<Button onClick={()=>addField("SELECT","Country")}>
+ Select
</Button>

<Button onClick={()=>addField("CHECKBOX","Skills")}>
+ Checkbox
</Button>

<Button onClick={()=>addField("RADIO","Gender")}>
+ Radio
</Button>

</div>

{

isLoading

?

<p>

Loading fields...

</p>

:

<div
className="
space-y-5"
>

{

(fields as Field[])

.map(
(field)=>(

<div
key={field.id}
className="
bg-white
rounded-xl
border
shadow-sm
p-5
space-y-4"
>

<h2
className="
font-semibold"
>

{field.label}

</h2>

<p>

Type:
{" "}
{field.type}

</p>

<Button

variant="destructive"

onClick={()=>

handleDelete(
field.id
)

}

>

<Trash2
size={16}
className="mr-2"
/>

Delete

</Button>

</div>

)

)

}

</div>

}

</div>

);

}