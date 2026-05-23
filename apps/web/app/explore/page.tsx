"use client";

import Link from "next/link";

import {
usePublicForms
}
from "~/hooks/api/form";

import {
Button
}
from "~/components/ui/button";

export default function ExplorePage(){

const{

forms=[],

isLoading

}=
usePublicForms();

return(

<div
className="
min-h-screen
bg-slate-100
p-10"
>

<div
className="
max-w-6xl
mx-auto"
>

<h1
className="
text-4xl
font-bold"
>

Explore Forms

</h1>

<p
className="
text-gray-500
mt-2
mb-10"
>

Discover public forms

</p>

{

isLoading

?

(

<p>

Loading...

</p>

)

:

forms.length===0

?

(

<div
className="
bg-white
rounded-xl
p-10
text-center"
>

No public forms found

</div>

)

:

(

<div
className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-5"
>

{

forms.map(
(form)=>(

<div

key={
form.id
}

className="
bg-white
rounded-xl
border
p-5
shadow-sm"
>

<h2
className="
font-bold
text-xl"
>

{form.title}

</h2>

<p
className="
text-gray-500
mt-2
min-h-[50px]"
>

{

form.description ||

"No description"

}

</p>

<Link
href={`/form/${form.id}`}
>

<Button
className="
mt-5
w-full"
>

Open Form

</Button>

</Link>

</div>

)

)

}

</div>

)

}

</div>

</div>

);

}