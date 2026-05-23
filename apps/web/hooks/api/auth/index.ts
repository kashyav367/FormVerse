import { trpc } from "~/trpc/client";

export const useSignup = () => {

  const utils =
    trpc.useUtils();

  const {

    mutateAsync:
      createUserWithEmailAndPasswordAsync,

    mutate:
      createUserWithEmailAndPassword,

    error,

    data,

    isIdle,

    isPending,

    isSuccess,

    failureCount,

  } =
    trpc.auth
      .createUserWithEmailAndPassword
      .useMutation({

        onSuccess:
          async()=>{

            await utils
              .auth
              .getLoggedInUserInfo
              .invalidate();

          },

      });

  return {

    createUserWithEmailAndPasswordAsync,

    createUserWithEmailAndPassword,

    error,

    data,

    isIdle,

    isPending,

    isSuccess,

    failureCount,

  };

};

export const useSignIn = () => {

  const utils =
    trpc.useUtils();

  const {

    mutateAsync:
      signInUserWithEmailAndPasswordAsync,

    mutate:
      signInUserWithEmailAndPassword,

    error,

    data,

    isIdle,

    isPending,

    isSuccess,

    failureCount,

  } =
    trpc.auth
      .signInUserWithEmailAndPassword
      .useMutation({

        onSuccess:
          async()=>{

            await utils
              .auth
              .getLoggedInUserInfo
              .invalidate();

          },

      });

  return {

    signInUserWithEmailAndPasswordAsync,

    signInUserWithEmailAndPassword,

    error,

    data,

    isIdle,

    isPending,

    isSuccess,

    failureCount,

  };

};

export const useUser = () => {

  const {

    data:
      user,

    error,

    isFetched,

    isLoading,

    status,

  } =
    trpc.auth
      .getLoggedInUserInfo
      .useQuery();

  return {

    user,

    error,

    isFetched,

    isLoading,

    status,

  };

};