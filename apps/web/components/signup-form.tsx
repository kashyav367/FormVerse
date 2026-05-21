"use client"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useForm, SubmitHandler } from "react-hook-form"
import { trpc } from "~/trpc/client"
import { useSignup } from "~/hooks/api/auth"
import { useRouter } from "next/navigation"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

   const {createUserWithEmailAndPasswordAsync}  = useSignup();
   const router = useRouter()
  const {
    register,
    handleSubmit,
  } = useForm<SignupFormValues>()

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
      console.log(values)

      const { id } =
        await createUserWithEmailAndPasswordAsync({
          email: values.email,
          fullName: values.name,
          password: values.password,
        })

      console.log(`User created with ID: ${id}`)
      router.replace("/dashboard")

  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            Create your account
          </h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            placeholder="John Doe"
            {...register("name")}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            {...register("password")}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            type="password"
            {...register("confirmPassword")}
            required
          />
        </Field>

        <Field>
          <Button type="submit">
            Create Account
          </Button>
        </Field>

        <FieldSeparator>
          Or continue with
        </FieldSeparator>

      </FieldGroup>
    </form>
  )
}