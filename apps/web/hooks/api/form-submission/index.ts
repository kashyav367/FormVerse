import { trpc } from "~/trpc/client";

export const useSubmitForm = () => {

  const {

    mutateAsync:
      submitFormAsync,

    isPending,

    error,

    isSuccess,

  } =
    trpc
      .formSubmission
      .createSubmission
      .useMutation();

  return {

    submitFormAsync,

    isPending,

    error,

    isSuccess,

  };

};

export const useListSubmissions =
(
  formId: string
) => {

  const {

    data:
      submissions = [],

    isPending,

  } =
    trpc
      .formSubmission
      .listSubmissions
      .useQuery({

        formId,

      });

  return {

    submissions,

    isLoading:
      isPending,

  };

};