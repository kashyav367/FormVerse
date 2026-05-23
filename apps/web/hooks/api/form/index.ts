import { trpc } from "~/trpc/client";

export const useCreateForm = () => {

const utils=
trpc.useUtils();

const {

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
async()=>{

await utils
.form
.invalidate();

},

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


export const useListForms=()=>{

const {

data:
forms=[],

error,

isFetching,

isLoading,

status,

}=trpc.form
.listForm
.useQuery(

undefined,

{

staleTime:
1000 * 60 * 5,

gcTime:
1000 * 60 * 10,

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


export const useDeleteForm=()=>{

const utils=
trpc.useUtils();

const {

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

await utils.form.invalidate();

}

});

return{

updateFormAsync,
isPending

};

};

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