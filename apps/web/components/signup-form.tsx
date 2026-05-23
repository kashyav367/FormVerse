"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

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
import { useSignup } from "~/hooks/api/auth";

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm(
  props: React.ComponentProps<typeof Card>
) {
  const router = useRouter();

  const {
    createUserWithEmailAndPasswordAsync,
    isPending,
  } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<
    SignupFormValues
  > = async (values) => {
    try {
      const { id } =
        await createUserWithEmailAndPasswordAsync({
          email: values.email.toLowerCase(),
          fullName: values.fullName,
          password: values.password,
        });

      console.log("Signup success:", id);

      router.push("/login");

    } catch (error) {
      console.error(
        "Signup Failed:",
        error
      );
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>
          Create an account
        </CardTitle>

        <CardDescription>
          Enter your information below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>

            <Field>
              <FieldLabel htmlFor="name">
                Full Name
              </FieldLabel>

              <Input
                id="name"
                placeholder="John Doe"
                {...register(
                  "fullName",
                  {
                    required:
                      "Full name is required",
                  }
                )}
              />

              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {
                    errors.fullName
                      .message
                  }
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                Email
              </FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="xyz@gmail.com"
                {...register(
                  "email",
                  {
                    required:
                      "Email is required",
                  }
                )}
              />

              <FieldDescription>
                We'll use this to
                contact you.
              </FieldDescription>

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>

              <Input
                id="password"
                type="password"
                {...register(
                  "password",
                  {
                    required:
                      "Password is required",
                    minLength: {
                      value: 8,
                      message:
                        "Minimum 8 characters required",
                    },
                  }
                )}
              />

              <FieldDescription>
                Must be at least 8
                characters long
              </FieldDescription>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>

              <Input
                id="confirm-password"
                type="password"
                {...register(
                  "confirmPassword",
                  {
                    required:
                      "Confirm password is required",
                    validate: (
                      value
                    ) =>
                      value ===
                        password ||
                      "Passwords do not match",
                  }
                )}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {
                    errors
                      .confirmPassword
                      .message
                  }
                </p>
              )}
            </Field>

            <Field>
              <Button
                className="w-full"
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? "Creating..."
                  : "Create Account"}
              </Button>
            </Field>

            <Field>
              <Button
                variant="outline"
                className="w-full"
                type="button"
              >
                Sign up with Google
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Already have an
              account?{" "}
              <Link
                href="/login"
                className="underline"
              >
                Sign in
              </Link>
            </FieldDescription>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}