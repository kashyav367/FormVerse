import { trpc } from "~/trpc/client";


/* ---------------- CREATE FORM ---------------- */

/* ---------------- CREATE FORM ---------------- */

export const useCreateForm=()=>{

const utils=
trpc.useUtils();

const{

mutateAsync:
createFormAsync,

mutate:
createForm,

error,

failureCount,

isError,

isIdle,

isPending,

isSuccess,

status,

}=trpc.form
.createForm
.useMutation({

onSuccess:
async(data)=>{

console.log(
"Form created:",
data
);

await Promise.all([

utils
.form
.listForm
.invalidate(),

utils
.form
.dashboardStats
.invalidate(),

utils
.form
.invalidate()

]);

},

onError:
(error)=>{

console.error(
"Create Form Error:",
error
);

}

});

return{

createFormAsync,

createForm,

error,

failureCount,

isError,

isIdle,

isPending,

isSuccess,

status,

};

};


/* ---------------- LIST FORMS ---------------- */

export const useListForms=(filters?:{

search?:string;

visibility?:
"PUBLIC"|
"UNLISTED";

isPublished?:
boolean;

})=>{

const{

data:
forms=[],

error,

isFetching,

isLoading,

status,

}=trpc.form
.listForm
.useQuery(

filters,

{

staleTime:
1000*60*5,

gcTime:
1000*60*10,

refetchOnWindowFocus:
false,

refetchOnReconnect:
false,

refetchOnMount:
false,

}

);

return{

forms,

error,

isFetching,

isLoading,

status,

};

};



/* ---------------- DASHBOARD STATS ---------------- */

export const useDashboardStats=()=>{

const{

data:
stats,

isLoading,

error,

}=

trpc.form
.dashboardStats
.useQuery();

return{

stats,

isLoading,

error

};

};



/* ---------------- DELETE ---------------- */

export const useDeleteForm=()=>{

const utils=
trpc.useUtils();

const{

mutateAsync:
deleteFormAsync,

error,

isPending,

isSuccess,

status,

}=trpc.form
.deleteForm
.useMutation({

onSuccess:
async()=>{

await utils
.form
.listForm
.invalidate();

await utils
.form
.dashboardStats
.invalidate();

},

});

return{

deleteFormAsync,

error,

isPending,

isSuccess,

status,

};

};



/* ---------------- UPDATE ---------------- */

export const useUpdateForm=()=>{

const utils=
trpc.useUtils();

const{

mutateAsync:
updateFormAsync,

isPending

}=

trpc.form
.updateForm
.useMutation({

onSuccess:
async()=>{

await utils
.form
.invalidate();

}

});

return{

updateFormAsync,
isPending

};

};



/* ---------------- GET FORM ---------------- */

export const useGetForm=(
formId:string
)=>{

const{

data:form,

isLoading

}=

trpc.form
.getForm
.useQuery({

formId

});

return{

form,
isLoading

};

};



/* ---------------- PUBLIC FORMS ---------------- */

export const usePublicForms=()=>{

const{

data:forms=[],

isLoading,

error

}=

trpc.form
.listPublicForms
.useQuery();

return{

forms,

isLoading,

error

};

};



/* ---------------- DUPLICATE ---------------- */

export const useDuplicateForm=()=>{

const utils=
trpc.useUtils();

const{

mutateAsync:
duplicateFormAsync,

isPending

}=

trpc.form
.duplicateForm
.useMutation({

onSuccess:
async()=>{

await utils
.form
.listForm
.invalidate();

await utils
.form
.dashboardStats
.invalidate();

}

});

return{

duplicateFormAsync,
isPending

};

};