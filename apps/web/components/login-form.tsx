"use client"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { useSignIn } from "~/hooks/api/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const{ signInWithEmailAndPasswordAsync } = useSignIn()
  type FormData = {
    email: string
    password: string
  }

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: FormData) => {
    console.log(data)
     const { id } = await signInWithEmailAndPasswordAsync({
        email: data.email,
        password: data.password
      })
    }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...field}
                    />
                  )}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input id="password" type="password" required {...field} />
                  )}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
