"use client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";

import { Input } from "~/components/ui/input";
import { useSignIn } from "~/hooks/api/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type SignInFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { signInUserWithEmailAndPasswordAsync } =
    useSignIn();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<SignInFormValues> =
    async (values) => {
      try {

        await signInUserWithEmailAndPasswordAsync({
          email: values.email,
          password: values.password,
        });

        console.log("Login Success");

        window.location.href = "/dashboard";

      } catch (error) {
        console.log("Login Failed:", error);
      }
    };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full max-w-[450px] relative",
        className
      )}
      {...props}
    >

      {/* background blur */}

      <div
        className="
        absolute
        -top-10
        -left-10
        w-36
        h-36
        rounded-full
        bg-[#ffd7d7]
        blur-[90px]
        opacity-50
        "
      />

      <div
        className="
        absolute
        -bottom-10
        -right-10
        w-36
        h-36
        rounded-full
        bg-[#ffe5c4]
        blur-[90px]
        opacity-50
        "
      />

      <Card
        className="
        relative
        bg-white/80
        backdrop-blur-xl
        border-white/40
        rounded-[35px]
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        overflow-hidden
        "
      >

        <CardHeader className="text-center pb-2">

          <div
            className="
            w-16
            h-16
            mx-auto
            rounded-full
            bg-[#ffeaea]
            flex
            items-center
            justify-center
            text-3xl
            mb-4
            shadow-md
            "
          >
            🌸
          </div>

          <CardTitle
            className="
            text-4xl
            font-serif
            font-bold
            "
          >
            Welcome Back
          </CardTitle>

          <CardDescription
            className="
            text-gray-500
            text-base
            mt-2
            "
          >
            Login to continue your FormVerse journey
          </CardDescription>

        </CardHeader>

        <CardContent className="px-8 pb-8">

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-5">

              <Field>

                <FieldLabel
                  htmlFor="email"
                  className="font-medium"
                >
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="name@gmail.com"
                  className="
                  h-12
                  rounded-2xl
                  bg-[#faf8f5]
                  border-0
                  shadow-sm
                  focus-visible:ring-[#ff7a7a]
                  "
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}

              </Field>


              <Field>

                <div className="flex items-center">

                  <FieldLabel
                    htmlFor="password"
                    className="font-medium"
                  >
                    Password
                  </FieldLabel>

                  <a
                    href="#"
                    className="
                    ml-auto
                    text-sm
                    text-[#ff6b6b]
                    hover:underline
                    "
                  >
                    {/* Forgot? */}
                  </a>

                </div>

                <Input
                  id="password"
                  type="password"
                  className="
                  h-12
                  rounded-2xl
                  bg-[#faf8f5]
                  border-0
                  shadow-sm
                  focus-visible:ring-[#ff7a7a]
                  "
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}

              </Field>

              <Field>

                <Button
                  className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#ff6b6b]
                  to-[#ff9393]
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  "
                  type="submit"
                >
                  Login →
                </Button>

              </Field>

              <FieldDescription
                className="
                text-center
                text-gray-500
                pt-2
                "
              >

                Don&apos;t have an account?

                <a
                  href="/signup"
                  className="
                  ml-2
                  font-semibold
                  text-[#ff6b6b]
                  hover:underline
                  "
                >
                  Sign up
                </a>

              </FieldDescription>

            </FieldGroup>
          </form>

        </CardContent>

      </Card>

    </div>
  );
}