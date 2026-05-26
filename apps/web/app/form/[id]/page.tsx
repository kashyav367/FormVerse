"use client";

import { useState } from "react";
import { useParams,useRouter } from "next/navigation";
import { useListFields } from "~/hooks/api/form-field";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { useGetForm } from "~/hooks/api/form";

type FormField={
id:string;
label:string;
labelKey:string;
type:string;
options?:string;
isRequired:boolean;
};

const themes={

Aurora:{
text:"text-[#4b3428]",
sub:"text-[#6f625b]",
input:"bg-[#fffdfa] border-[#eadfd5]",
button:"from-[#d58a52] to-[#e6a772]",
badge:"bg-[#fde8e5] text-[#d58a52]"
},

Sakura:{
text:"text-[#6b3948]",
sub:"text-[#7f6870]",
input:"bg-[#fffafb] border-pink-100",
button:"from-pink-400 to-rose-400",
badge:"bg-pink-100 text-pink-500"
},

Kyoto:{
text:"text-[#5b3c2f]",
sub:"text-[#7f6d63]",
input:"bg-[#fffdfb] border-[#ead8c8]",
button:"from-[#c97845] to-[#e2a16e]",
badge:"bg-[#f4e5d8] text-[#c97845]"
},

Zen:{
text:"text-[#41593c]",
sub:"text-[#677460]",
input:"bg-[#fafdf8] border-[#d8e6d1]",
button:"from-[#88a66f] to-[#a7c38e]",
badge:"bg-[#edf5e7] text-[#6b8e58]"
}

};

export default function PublicFormPage(){

const params=useParams();
const formId=params.id as string;
const router=useRouter();

const [responses,setResponses]=
useState<Record<string,any>>({});

const {fields=[]}=
useListFields(formId);

const {
form,
isLoading:formLoading
}=useGetForm(formId);

const {
submitFormAsync,
isPending
}=useSubmitForm();

const currentTheme=(()=>{

const theme=
form?.theme?.toLowerCase()||"";

if(theme.includes("sakura"))
return themes.Sakura;

if(theme.includes("kyoto"))
return themes.Kyoto;

if(theme.includes("zen"))
return themes.Zen;

return themes.Aurora;

})();

const completedFields=
Object.values(responses)
.filter(v=>v!==""&&v!==undefined)
.length;

if(formLoading){

return(
<div className="min-h-screen flex items-center justify-center">
Loading...
</div>
);

}

if(!form){

return(
<div className="min-h-screen flex items-center justify-center">
Form not found
</div>
);

}

const validate=()=>{

for(const field of fields as FormField[]){

const value=
responses[field.labelKey];

if(
field.isRequired &&
(!value||value==="")
){

alert(`${field.label} required`);

return false;

}

}

return true;

};

const handleSubmit=async()=>{

if(!validate()) return;

try{

await submitFormAsync({

formId,
responseData:responses

});

router.push("/thank-you");

}catch{

alert("Submission Failed");

}

};

return(

<div
className="

min-h-screen
relative
overflow-hidden
px-6
py-20

bg-gradient-to-br
from-[#fff9f6]
via-[#fefcfb]
to-[#eef5ea]

"
>

<div className="absolute top-0 left-0 w-[350px] h-[350px] bg-pink-100/30 rounded-full blur-[120px]"/>

<div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-green-100/30 rounded-full blur-[120px]"/>


<div className="max-w-2xl mx-auto relative z-10">

<div
className="

bg-white/95
backdrop-blur-xl

rounded-[38px]

border
border-[#efe5db]

shadow-[0_25px_70px_rgba(0,0,0,.07)]

p-8
md:p-12

"
>

<div className="flex justify-between items-center mb-8">

<div
className={`

px-4
py-2
rounded-full
text-sm
font-semibold

${currentTheme.badge}

`}
>

✨ FormVerse

</div>

<div
className="
bg-gray-100
px-4
py-2
rounded-full
text-sm
text-gray-500
"
>

{completedFields}/{fields.length}

</div>

</div>


<h1
className={currentTheme.text}
style={{

fontFamily:"Georgia, serif",

fontSize:"clamp(40px,5vw,56px)",

fontWeight:700,

lineHeight:"1.1",

letterSpacing:"-1px"

}}
>

{form.title}

</h1>


<p
className={`${currentTheme.sub} mt-4 mb-10`}
style={{

fontSize:"18px",
lineHeight:"1.8",
fontWeight:"500"

}}
>

{form.description}

</p>


<div className="space-y-7">

{

(fields as FormField[])

.map(field=>(

<div key={field.id}>

<label
className={`

block
mb-3
font-semibold
text-[16px]

${currentTheme.text}

`}
>

{field.label}

{

field.isRequired&&

<span className="text-red-500 ml-1">

*

</span>

}

</label>

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

value={
responses[field.labelKey]||""
}

onChange={(e)=>

setResponses(prev=>({

...prev,

[field.labelKey]:
e.target.value

}))

}

placeholder={`Enter ${field.label}`}

className={`

w-full
h-[60px]

rounded-2xl

border

px-5

text-[16px]
font-medium

outline-none

transition-all

focus:border-[#d58a52]

focus:shadow-[0_0_0_4px_rgba(213,138,82,.12)]

${currentTheme.input}

`}

/>

</div>

))

}

<button

disabled={isPending}

onClick={handleSubmit}

className={`

w-full
h-[64px]

rounded-2xl

text-white
text-lg
font-semibold

bg-gradient-to-r

shadow-lg

transition-all

hover:-translate-y-1

${currentTheme.button}

`}
>

{

isPending
?
"Submitting..."
:
"Submit Response →"

}

</button>

</div>

</div>

</div>

</div>

);

}