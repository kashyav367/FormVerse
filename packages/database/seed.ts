import db from "./index";

import { formTable } from "./models/form";
import { formSubmissions } from "./models/form-submission";
import { formFields } from "./models/form-field";

// Existing user ID
const userId =
"1bd704fd-fe00-430c-b65e-af313b64892f";

async function seed() {

console.log("Seeding database...");


// ---------------- FORM 1 ----------------

const [animeForm] =
await db
.insert(formTable)
.values({

title:"Anime Fan Survey",

description:
"Anime community feedback",

visibility:"PUBLIC",

createdBy:userId

})
.returning();


// Anime Fields

await db
.insert(formFields)
.values([

{
formId:animeForm.id,
label:"Name",
type:"TEXT",
required:true,
order:1
},

{
formId:animeForm.id,
label:"Favorite Anime",
type:"TEXT",
required:true,
order:2
},

{
formId:animeForm.id,
label:"Rating",
type:"NUMBER",
required:true,
order:3
},

{
formId:animeForm.id,
label:"Favorite Character",
type:"TEXT",
required:false,
order:4
}

]);



// ---------------- FORM 2 ----------------

const [startupForm] =
await db
.insert(formTable)
.values({

title:"Startup Product Feedback",

description:"Feedback collection",

visibility:"PUBLIC",

createdBy:userId

})
.returning();


// Startup Fields

await db
.insert(formFields)
.values([

{
formId:startupForm.id,
label:"Name",
type:"TEXT",
required:true,
order:1
},

{
formId:startupForm.id,
label:"Email",
type:"EMAIL",
required:true,
order:2
},

{
formId:startupForm.id,
label:"Rating",
type:"NUMBER",
required:true,
order:3
},

{
formId:startupForm.id,
label:"Feedback",
type:"TEXTAREA",
required:false,
order:4
}

]);



// ---------------- FORM 3 ----------------

const [gamingForm] =
await db
.insert(formTable)
.values({

title:"Gaming Tournament Registration",

description:"Gaming registration form",

visibility:"UNLISTED",

createdBy:userId

})
.returning();


// Gaming Fields

await db
.insert(formFields)
.values([

{
formId:gamingForm.id,
label:"Player Name",
type:"TEXT",
required:true,
order:1
},

{
formId:gamingForm.id,
label:"Game",
type:"TEXT",
required:true,
order:2
},

{
formId:gamingForm.id,
label:"Rank",
type:"TEXT",
required:true,
order:3
}

]);




// Anime Responses

await db
.insert(formSubmissions)
.values([

{
formId:animeForm.id,
responseData:JSON.stringify({
name:"Ankit",
anime:"Naruto",
rating:"5",
character:"Itachi"
})
},

{
formId:animeForm.id,
responseData:JSON.stringify({
name:"Rahul",
anime:"One Piece",
rating:"4",
character:"Zoro"
})
}

]);




// Startup Responses

await db
.insert(formSubmissions)
.values([

{
formId:startupForm.id,
responseData:JSON.stringify({
name:"John",
email:"john@gmail.com",
rating:"4",
feedback:"Nice UI"
})
},

{
formId:startupForm.id,
responseData:JSON.stringify({
name:"Sarah",
email:"sarah@gmail.com",
rating:"5",
feedback:"Amazing"
})
}

]);




// Gaming Responses

await db
.insert(formSubmissions)
.values([

{
formId:gamingForm.id,
responseData:JSON.stringify({
player:"Shadow",
game:"Valorant",
rank:"Diamond"
})
},

{
formId:gamingForm.id,
responseData:JSON.stringify({
player:"Ace",
game:"PUBG",
rank:"Ace"
})
}

]);

console.log("Seed completed 🚀");

}

seed()
.then(()=>{

process.exit(0);

})
.catch((error)=>{

console.error(
"Seed failed:",
error
);

process.exit(1);

});