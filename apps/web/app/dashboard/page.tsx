"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";
import Link from "next/link";

import {
Trash2,
Compass,
Copy,
Sparkles,
FileText
} from "lucide-react";

import { Button } from "~/components/ui/button";

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger
} from "~/components/ui/alert-dialog";

import {
useListForms,
useDeleteForm,
useDuplicateForm,
useDashboardStats
} from "~/hooks/api/form";

export default function DashboardPage(){

const router = useRouter();

const {
user,
isLoading:isUserLoading
} = useUser();

useEffect(()=>{

if(isUserLoading) return;

if(!user){

router.replace("/login");

}

},[
user,
isUserLoading,
router
]);    

const [search,setSearch]=useState("");

const{
forms=[],
isLoading
}=useListForms({
search
});

const{
stats
}=useDashboardStats();

const{
deleteFormAsync,
isPending:isDeleting
}=useDeleteForm();

const{
duplicateFormAsync,
isPending:isDuplicating
}=useDuplicateForm();

const handleDelete=
async(formId:string)=>{

await deleteFormAsync({
formId
});

};

const handleDuplicate=
async(formId:string)=>{

await duplicateFormAsync({
formId
});

};

if(isUserLoading){

return(
<div
className="
min-h-screen
flex
items-center
justify-center
"
>
Loading...
</div>
);

}

if(!user){

return null;

}

return(

<div
className="
min-h-screen
bg-[#f7f2ec]
px-6
py-8
"
>

<div
className="
max-w-7xl
mx-auto
"
>

{/* HEADER */}

<div
className="
flex
justify-between
items-center
mb-10
"
>

<div>

<div
className="
inline-flex
items-center
gap-2
rounded-full
bg-[#fde8e5]
text-[#d25543]
px-4
py-2
mb-5
"
>

<Sparkles size={14}/>

FormVerse

</div>

<h1
className="
text-[70px]
font-serif
font-bold
"
>

Dashboard

</h1>

<p
className="
text-gray-500
mt-2
"
>

Manage your forms beautifully

</p>

</div>

<div className="flex gap-3">

<Link href="/explore">

<Button
variant="outline"
className="rounded-full"
>

<Compass
size={14}
className="mr-2"
/>

Explore

</Button>

</Link>

<Link
href="/dashboard/create"
>

<Button
className="
rounded-full
bg-[#d25543]
hover:bg-[#bf4938]
"
>

+ Create Form

</Button>

</Link>

</div>

</div>

{/* SEARCH */}

<input

value={search}

onChange={(e)=>{

setSearch(
e.target.value
);

}}

placeholder="🔍 Search forms..."

className="
w-full
h-14
rounded-full
border
px-6
mb-10
bg-white
"
/>


{/* STATS */}

<div
className="
grid
grid-cols-2
lg:grid-cols-4
gap-6
mb-12
"
>

{[

{
label:"Forms",
value:stats?.totalForms||0
},

{
label:"Published",
value:stats?.publishedForms||0
},

{
label:"Unlisted",
value:stats?.unlistedForms||0
},

{
label:"Responses",
value:stats?.totalResponses||0
}

].map((item)=>(

<div

key={item.label}

className="
bg-white
rounded-[30px]
p-6
shadow-sm
"

>

<h2
className="
text-4xl
font-bold
"
>

{item.value}

</h2>

<p
className="
text-gray-500
mt-2
"
>

{item.label}

</p>

</div>

))

}

</div>


{/* EMPTY */}

{

!isLoading&&
forms.length===0

&&(

<div
className="
bg-white
rounded-[35px]
p-16
text-center
"
>

<FileText
size={60}
className="
mx-auto
mb-5
text-gray-400
"
/>

<h2
className="
text-3xl
font-serif
font-bold
"
>

No forms yet

</h2>

<p
className="
text-gray-500
mt-3
"
>

Create your first form

</p>

<Link
href="/dashboard/create"
>

<Button
className="
mt-6
bg-[#d25543]
"
>

Create Form

</Button>

</Link>

</div>

)

}


{/* FORM CARDS */}

<div
className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
"
>

{

forms.map(
(form:any)=>(

<div

key={form.id}

className="
bg-white
rounded-[35px]
p-6
shadow-sm
hover:shadow-xl
transition-all
border
"

>

<div
className="
flex
justify-between
mb-4
"
>

<span
className={`

text-xs
px-3
py-1
rounded-full

${
form.visibility==="PUBLIC"

?

"bg-green-100 text-green-700"

:

"bg-orange-100 text-orange-700"

}

`}
>

{
form.visibility
}

</span>

<span
className="
text-xs
text-gray-400
"
>
{form.responseCount || 0}
Responses


</span>

</div>


<h2
className="
text-2xl
font-serif
font-bold
"
>

{form.title}

</h2>

<p
className="
text-gray-500
mt-3
min-h-[50px]
"
>

{
form.description||
"No description"
}

</p>


<div
className="
grid
grid-cols-2
gap-2
mt-6
"
>

<Link
href={`/dashboard/builder/${form.id}`}
>

<Button
className="
w-full
bg-black
"
>

Builder

</Button>

</Link>


<Link
href={`/dashboard/responses/${form.id}`}
>

<Button
variant="outline"
className="
w-full
"
>

📊 Responses

</Button>

</Link>


<Button

variant="outline"

disabled={
isDuplicating
}

onClick={()=>
handleDuplicate(
form.id
)
}

>

<Copy
size={14}
className="mr-2"
/>

Duplicate

</Button>


<AlertDialog>

<AlertDialogTrigger
asChild
>

<Button
variant="destructive"
>

<Trash2
size={14}
className="mr-2"
/>

Delete

</Button>

</AlertDialogTrigger>

<AlertDialogContent>

<AlertDialogHeader>

<AlertDialogTitle>

Delete Form?

</AlertDialogTitle>

<AlertDialogDescription>

This action cannot be undone.

</AlertDialogDescription>

</AlertDialogHeader>

<AlertDialogFooter>

<AlertDialogCancel>

Cancel

</AlertDialogCancel>

<AlertDialogAction

disabled={
isDeleting
}

onClick={()=>
handleDelete(
form.id
)
}

>

Delete

</AlertDialogAction>

</AlertDialogFooter>

</AlertDialogContent>

</AlertDialog>

</div>

</div>

))

}

</div>

</div>

</div>

);

}