"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ThankYouPage(){

return(

<div
className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
p-6"
>

<div
className="
bg-white
rounded-2xl
shadow-lg
max-w-md
w-full
p-10
text-center"
>

<div
className="
text-6xl
mb-5"
>

🎉

</div>

<h1
className="
text-3xl
font-bold"
>

Response Submitted

</h1>

<p
className="
text-gray-500
mt-3"
>

Thank you for submitting the form

</p>

<div
className="
mt-8
space-y-3"
>

<Link
href="/"
>

<Button
className="
w-full"
>

Go Home

</Button>

</Link>

</div>

</div>

</div>

);

}