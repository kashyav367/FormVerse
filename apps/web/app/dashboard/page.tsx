"use client";

import Link from "next/link";
import {
Trash2,
FileText,
Compass
}
from "lucide-react";

import {
Button
}
from "~/components/ui/button";

import {
useListForms,
useDeleteForm
}
from "~/hooks/api/form";

export default function DashboardPage(){

const{

forms=[],

isLoading,

}=
useListForms();

const{

deleteFormAsync,

isPending:
isDeleting,

}=
useDeleteForm();

const handleDelete=
async(
formId:string
)=>{

const confirmed=
confirm(
"Delete this form?"
);

if(
!confirmed
)
return;

try{

await deleteFormAsync({

formId

});

}

catch(error){

console.log(
error
);

}

};

return(

<div
className="
min-h-screen
bg-[#faf8fc]
p-8"
>

<div
className="
flex
justify-between
items-center
mb-10"
>

<div>

<h1
className="
text-4xl
font-bold"
>

Dashboard

</h1>

<p
className="
text-gray-500
mt-2"
>

Manage all your forms

</p>

<p
className="
text-sm
text-gray-400
mt-1"
>

Total Forms:
{" "}
{forms.length}

</p>

</div>

<div
className="
flex
gap-3"
>

<Link
href="/explore"
>

<Button
variant="outline"
>

<Compass
size={16}
className="mr-2"
/>

Explore

</Button>

</Link>

<Link
href="/dashboard/create"
>

<Button>

+ Create Form

</Button>

</Link>

</div>

</div>

{

isLoading

?

(

<div
className="
text-center
py-20"
>

<p
className="
text-gray-500
text-lg"
>

Loading forms...

</p>

</div>

)

:

forms.length===0

?

(

<div
className="
bg-white
rounded-2xl
border
shadow-sm
p-12
text-center"
>

<FileText
size={45}
className="
mx-auto
mb-4
text-gray-400"
/>

<h2
className="
font-bold
text-2xl"
>

No Forms Found

</h2>

<p
className="
text-gray-500
mt-3"
>

Create your first form

</p>

<Link
href="/dashboard/create"
>

<Button
className="
mt-6"
>

+ Create Form

</Button>

</Link>

</div>

)

:

(

<div
className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-6"
>

{

forms.map(
(form:any)=>(

<div

key={
form.id
}

className="
bg-white
rounded-2xl
border
p-6
relative
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300"
>

<button

onClick={()=>

handleDelete(
form.id
)

}

disabled={
isDeleting
}

className="
absolute
top-4
right-4
text-red-500
hover:text-red-700"
>

<Trash2
size={18}
/>

</button>

<h2
className="
font-bold
text-2xl"
>

{form.title}

</h2>

<p
className="
text-gray-500
mt-3
min-h-[50px]"
>

{

form.description ||

"No description"

}

</p>

{

form.createdAt && (

<p
className="
text-xs
text-gray-400
mt-3"
>

Created:
{" "}

{

new Date(
form.createdAt
)
.toLocaleDateString()

}

</p>

)

}

<div
className="
flex
flex-wrap
gap-2
mt-6"
>

<Link
href={`/dashboard/builder/${form.id}`}
>

<Button>

Builder

</Button>

</Link>

<Link
href={`/form/${form.id}`}
>

<Button
variant="outline"
>

Public

</Button>

</Link>

<Link
href={`/responses/${form.id}`}
>

<Button
variant="secondary"
>

Responses

</Button>

</Link>

</div>

</div>

)

)

}

</div>

)

}

</div>

);

}