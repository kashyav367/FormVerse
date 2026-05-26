"use client";

import { useRouter } from "next/navigation";
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

  const router =
    useRouter();

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

            console.log(
              "Login Success"
            );

            router.replace(
              "/dashboard"
            );

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
      .useQuery(

        undefined,

        {

          retry:false,

          throwOnError:false,

          refetchOnWindowFocus:false,

        }

      );

  return {

    user,

    error,

    isFetched,

    isLoading,

    status,

  };

};

export const useLogout = () => {

const router =
useRouter();

const utils =
trpc.useUtils();

const {

mutateAsync:
logoutAsync,

isPending

} =
trpc.auth
.logout
.useMutation({

onSuccess: async()=>{

await utils.auth.getLoggedInUserInfo.reset();

await utils.invalidate();

router.replace("/");

}

});

return {

logoutAsync,

isPending

};

};