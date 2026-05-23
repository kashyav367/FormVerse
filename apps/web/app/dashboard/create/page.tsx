"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "~/components/ui/card";

import { Input } from "~/components/ui/input";

import {
useCreateForm
} from "~/hooks/api/form";

type CreateFormValues = {

title:string;

description:string;

};

export default function CreateFormPage(){

const router =
useRouter();

const {

createFormAsync,

isPending,

}=
useCreateForm();

const {

register,

handleSubmit,

formState:{
errors
},

reset,

}=useForm<CreateFormValues>();

const onSubmit =
async(
values:
CreateFormValues
)=>{

try{

const response=

await createFormAsync({

title:
values.title,

description:
values.description,

});

console.log(
"Created Form:",
response
);

reset();

router.push(

`/dashboard/builder/${response.id}`

);

}

catch(error){

console.log(
"Create Form Error:",
error
);

alert(
"Failed to create form"
);

}

};

return(

<div
className="
min-h-screen
flex
items-center
justify-center
p-8
bg-slate-100"
>

<Card
className="
w-full
max-w-xl
shadow-lg"
>

<CardHeader>

<CardTitle
className="
text-2xl
font-bold"
>

Create New Form

</CardTitle>

</CardHeader>

<CardContent>

<form

onSubmit={
handleSubmit(
onSubmit
)
}

className="
space-y-5"
>

<div>

<Input

placeholder="Form Title"

{...register(
"title",
{
required:
"Title required"
}
)}

/>

{

errors.title && (

<p
className="
text-red-500
text-sm
mt-1"
>

{
errors.title.message
}

</p>

)

}

</div>

<div>

<Input

placeholder="Description"

{...register(
"description"
)}

/>

</div>

<Button

type="submit"

className="
w-full"

disabled={
isPending
}

>

{

isPending

?

"Creating..."

:

"Create Form"

}

</Button>

</form>

</CardContent>

</Card>

</div>

);

}