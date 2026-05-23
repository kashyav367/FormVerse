"use client";

import { useParams } from "next/navigation";
import { useListSubmissions } from "~/hooks/api/form-submission";

export default function ResponsesPage(){

const params=
useParams();

const formId=
params.id as string;

const {

submissions=[],

isLoading

}=
useListSubmissions(
formId
);

const totalResponses=
submissions.length;

const todayResponses=

submissions.filter(
(submission:any)=>{

const date=
new Date(
submission.createdAt
);

const today=
new Date();

return(

date.toDateString()

===

today.toDateString()

);

}
).length;

const averageFields=

submissions.length>0

?

Math.round(

submissions.reduce(
(acc:number,item:any)=>{

try{

const values=

Object.keys(

typeof item.responseData==="string"

?

JSON.parse(
item.responseData
)

:

item.responseData

).length;

return acc+values;

}

catch{

return acc;

}

},
0
)

/

submissions.length

)

:

0;


const exportCSV=()=>{

if(
submissions.length===0
){

alert(
"No responses found"
);

return;

}

const rows=

submissions.map(
(item:any)=>{

return(

typeof item.responseData==="string"

?

JSON.parse(
item.responseData
)

:

item.responseData

);

}
);

const headers=

[
...new Set(

rows.flatMap(
(row:any)=>

Object.keys(
row
)

)

)

];

const csv=[

headers.join(","),

...rows.map(
(row:any)=>

headers.map(
(header)=>

JSON.stringify(

row[
header
] || ""

)

)

.join(",")

)

]

.join("\n");

const blob=
new Blob(

[csv],

{
type:
"text/csv"
}

);

const url=

URL.createObjectURL(
blob
);

const link=

document.createElement(
"a"
);

link.href=
url;

link.download=
"responses.csv";

link.click();

URL.revokeObjectURL(
url);

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
max-w-6xl
mx-auto"
>

<div
className="
flex
justify-between
items-center"
>

<div>

<h1
className="
text-4xl
font-bold"
>

Responses Dashboard

</h1>

<p
className="
text-gray-500
mt-2"
>

Analytics + Responses

</p>

</div>

<button

onClick={
exportCSV
}

className="
bg-black
text-white
px-5
py-3
rounded-lg
hover:opacity-90"
>

Export CSV

</button>

</div>

<div
className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-4
mt-8"
>

<div
className="
bg-white
rounded-xl
shadow
p-6"
>

<p
className="
text-gray-500"
>

Total Responses

</p>

<h2
className="
text-4xl
font-bold"
>

{totalResponses}

</h2>

</div>

<div
className="
bg-white
rounded-xl
shadow
p-6"
>

<p
className="
text-gray-500"
>

Today's Responses

</p>

<h2
className="
text-4xl
font-bold"
>

{todayResponses}

</h2>

</div>

<div
className="
bg-white
rounded-xl
shadow
p-6"
>

<p
className="
text-gray-500"
>

Avg Fields Filled

</p>

<h2
className="
text-4xl
font-bold"
>

{averageFields}

</h2>

</div>

<div
className="
bg-white
rounded-xl
shadow
p-6"
>

<p
className="
text-gray-500"
>

Latest Response

</p>

<h2
className="
text-xl
font-bold"
>

{

submissions.length>0

?

`#${submissions.length}`

:

"No response"

}

</h2>

</div>

</div>

<div
className="
mt-10
space-y-6"
>

{

isLoading

?

(

<div
className="
bg-white
rounded-xl
p-6"
>

Loading responses...

</div>

)

:

submissions.length===0

?

(

<div
className="
bg-white
rounded-xl
p-10
text-center"
>

<h2
className="
text-xl
font-bold"
>

No Responses Found

</h2>

<p
className="
text-gray-500
mt-2"
>

Waiting for submissions

</p>

</div>

)

:

submissions.map(
(
submission:any,
index:number
)=>{

let data={};

try{

data=

typeof submission.responseData==="string"

?

JSON.parse(
submission.responseData
)

:

submission.responseData;

}

catch{

data={};

}

return(

<div
key={
submission.id
}

className="
bg-white
rounded-xl
shadow
p-6"
>

<div
className="
flex
justify-between
items-center
mb-4"
>

<h2
className="
font-bold
text-lg"
>

Submission #

{index+1}

</h2>

<p
className="
text-sm
text-gray-500"
>

{

submission.createdAt

?

new Date(
submission.createdAt
)
.toLocaleString()

:

""

}

</p>

</div>

<div
className="
space-y-3"
>

{

Object.entries(
data
)

.map(
(
[key,value]
)=>(

<div
key={key}
className="
border-b
pb-3"
>

<p
className="
text-sm
text-gray-500"
>

{

key.replaceAll(
"_",
" "
)

}

</p>

<p
className="
font-medium"
>

{

Array.isArray(
value
)

?

value.join(", ")

:

String(
value
)

}

</p>

</div>

)

)

}

</div>

</div>

);

})

}

</div>

</div>

</div>

);

}