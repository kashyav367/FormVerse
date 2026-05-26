"use client";

import { useParams } from "next/navigation";
import { useListSubmissions } from "~/hooks/api/form-submission";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
BarChart,
Bar,
PieChart,
Pie,
Cell,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function ResponsesPage(){

const params=useParams();

const formId=params.id as string;

const{
submissions=[],
isLoading
}=useListSubmissions(formId);


/* normalize data */

const parsedSubmissions=

submissions.map(
(item:any)=>{

let data={};

try{

data=

typeof item.responseData==="string"

?

JSON.parse(
item.responseData
)

:

item.responseData || {};

}

catch{

data={};

}

return{

...item,

responseData:data

};

}
);


if(isLoading){

return(

<div
className="
h-screen
flex
items-center
justify-center
text-2xl
font-bold
"
>

Loading Responses...

</div>

);

}


const totalResponses=
parsedSubmissions.length;


const averageFields=

parsedSubmissions.length

?

Math.round(

parsedSubmissions.reduce(

(sum:number,item:any)=>

sum+

Object.keys(
item.responseData
).length

,0

)

/

parsedSubmissions.length

)

:0;



const latestResponse=

parsedSubmissions.length

?

parsedSubmissions[
parsedSubmissions.length-1
]?.submittedAt

?

new Date(

String(

parsedSubmissions[
parsedSubmissions.length-1
].submittedAt

)

).toLocaleString(
"en-IN",
{
day:"numeric",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
}
)

:

"-"

:

"No response";



const barData=[

{
name:"Responses",
value:totalResponses
},

{
name:"Avg Fields",
value:averageFields
}

];


const pieData=[

{
name:"Filled",
value:averageFields
},

{
name:"Remaining",
value:
Math.max(
10-averageFields,
0
)
}

];



return(

<div
className="
min-h-screen
bg-[#f7f2ec]
py-10
"
>

<div
className="
max-w-7xl
mx-auto
px-6
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
bg-[#fde8e5]
text-[#d25543]
px-4
py-2
rounded-full
mb-4
"
>

✨ FormVerse

</div>

<h1
className="
text-6xl
font-serif
font-bold
"
>

Responses

</h1>

<p
className="
text-gray-500
mt-2
"
>

Analytics + Insights

</p>

</div>

<Link
href="/dashboard"
>

<button
className="
bg-white
rounded-full
w-14
h-14
shadow-md
flex
items-center
justify-center
"
>

<ArrowLeft size={22}/>

</button>

</Link>

</div>


{/* CARDS */}

<div
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
"
>

{

[

{
label:"Total Responses",
value:totalResponses
},

{
label:"Completion",
value:
totalResponses
?
"100%"
:
"0%"
},

{
label:"Avg Fields",
value:averageFields
},

{
label:"Latest",
value:latestResponse
}

]

.map(
(card)=>(

<div
key={card.label}
className="
bg-white
rounded-[30px]
p-6
shadow-md
border
border-[#eadfd5]
"
>

<p
className="
text-gray-500
text-sm
"
>

{card.label}

</p>

<h2
className="
text-3xl
font-bold
mt-3
break-words
"
>

{card.value}

</h2>

</div>

)

)

}

</div>



{/* CHARTS */}

<div
className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
mt-10
"
>

<div
className="
bg-white
rounded-[35px]
shadow-md
p-6
h-[350px]
"
>

<h2
className="
font-bold
text-xl
mb-4
"
>

📊 Response Analytics

</h2>

<ResponsiveContainer
width="100%"
height="90%"
>

<BarChart
data={barData}
>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar
dataKey="value"
fill="#d25543"
radius={[12,12,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>


<div
className="
bg-white
rounded-[35px]
shadow-md
p-6
h-[350px]
"
>

<h2
className="
font-bold
text-xl
mb-4
"
>

🥧 Field Distribution

</h2>

<ResponsiveContainer
width="100%"
height="90%"
>

<PieChart>

<Pie
data={pieData}
dataKey="value"
outerRadius={100}
label
>

{

pieData.map(
(_,index)=>(

<Cell
key={index}
fill={
index===0
?
"#d25543"
:
"#ffb3aa"
}
/>

)

)

}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>



{/* TABLE */}

<div
className="
bg-white
rounded-[35px]
shadow-md
mt-10
p-8
"
>

<div
className="
flex
justify-between
mb-6
"
>

<h2
className="
text-3xl
font-bold
"
>

📋 Response Data

</h2>

<p
className="
text-gray-500
"
>

{totalResponses} submissions

</p>

</div>


{

parsedSubmissions.length===0

?

(

<div
className="
text-center
py-10
text-gray-400
"
>

No Responses Yet 🚀

</div>

)

:

(

<div
className="
overflow-x-auto
"
>

<table
className="
w-full
"
>

<thead>

<tr
className="
bg-[#faf6f2]
border-b
"
>

<th className="p-4 text-left">#</th>
<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Email</th>
<th className="p-4 text-left">Description</th>
<th className="p-4 text-left">Fields</th>
<th className="p-4 text-left">Date</th>

</tr>

</thead>


<tbody>

{

parsedSubmissions.map(
(item:any,index:number)=>(

<tr
key={index}
className="
border-b
hover:bg-[#faf6f2]
"
>

<td className="p-4">
{index+1}
</td>

<td className="p-4">
{item.responseData.name || "-"}
</td>

<td className="p-4">
{item.responseData.email || "-"}
</td>

<td className="p-4">
{item.responseData.description || "-"}
</td>

<td className="p-4">

{
Object.keys(
item.responseData
).length
}

</td>

<td className="p-4">

{
item.submittedAt

?

new Date(
String(
item.submittedAt
)
).toLocaleString(
"en-IN",
{
day:"numeric",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
}
)

:

"-"
}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

)

}

</div>

</div>

</div>

);

}