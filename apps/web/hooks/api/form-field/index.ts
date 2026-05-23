import { trpc } from "~/trpc/client";

export const useCreateField=()=>{

const utils=
trpc.useUtils();

const mutation=
trpc.formField.createField.useMutation({

onSuccess:async()=>{

await utils.formField.invalidate();

}

});

return{

createFieldAsync:
mutation.mutateAsync,

createField:
mutation.mutate,

isPending:
mutation.isPending,

};

};

export const useUpdateField=()=>{

const utils=
trpc.useUtils();

const mutation=
trpc.formField.updateField.useMutation({

onSuccess:async()=>{

await utils.formField.invalidate();

}

});

return{

updateFieldAsync:
mutation.mutateAsync,

isPending:
mutation.isPending,

};

};

export const useDeleteField=()=>{

const utils=
trpc.useUtils();

const mutation=
trpc.formField.deleteField.useMutation({

onSuccess:async()=>{

await utils.formField.invalidate();

}

});

return{

deleteFieldAsync:
mutation.mutateAsync,

isPending:
mutation.isPending,

};

};

export const useListFields=(
formId:string
)=>{

const {

data=[],

isLoading,

}=trpc.formField.listFields.useQuery({

formId

});

return{

fields:data,

isLoading

};

};