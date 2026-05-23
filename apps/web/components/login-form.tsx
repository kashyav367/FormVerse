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

        router.push("/dashboard");

      } catch (error) {
        console.log("Login Failed:", error);
      }
    };

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>

          <CardTitle>
            Login to your account
          </CardTitle>

          <CardDescription>
            Enter your email below to login
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">

                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <a
                    href="#"
                    className="ml-auto text-sm hover:underline"
                  >
                    Forgot Password?
                  </a>

                </div>

                <Input
                  id="password"
                  type="password"
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
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              </Field>

              <Field>
                <Button
                  className="w-full"
                  type="submit"
                >
                  Login
                </Button>
              </Field>

              <Field>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                >
                  Login with Google
                </Button>
              </Field>

              <FieldDescription className="text-center">

                Don&apos;t have an account?{" "}

                <a
                  href="/signup"
                  className="underline"
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