import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.listForm.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
    status,
  };
};

export const useListForms = () => {
  const {
    data: forms,
    error,
    isFetching,
    isLoading,
    status,
  } = trpc.form.listForm.useQuery(undefined);

  return {
    forms,
    error,
    isFetching,
    isLoading,
    status,
  };
};