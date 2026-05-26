"use client";

import Link from "next/link";
import { useSignup } from "~/hooks/api/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type SignUpFormValues = {
  name:string;
  email:string;
  password:string;
  confirmPassword:string;
};

export function SignupForm() {

  const router=useRouter();

  const {
    createUserWithEmailAndPasswordAsync,
    isPending
  }=useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState:{errors}
  }=useForm<SignUpFormValues>();


  const onSubmit:SubmitHandler<SignUpFormValues>=
  async(values)=>{

    try{

      await createUserWithEmailAndPasswordAsync({

        fullName:values.name,
        email:values.email,
        password:values.password

      });

      router.push("/dashboard");

    }catch(err){

      console.log(
        "Signup Failed:",
        err
      );

    }

  };


return(

<div
className="
w-full
max-w-[460px]
relative
animate-[fadeIn_0.7s_ease]
"
>

<div
className="
absolute
-top-6
-left-6
w-32
h-32
bg-[#ff7a7a]/20
blur-3xl
rounded-full
"
/>

<div
className="
absolute
bottom-0
right-0
w-28
h-28
bg-[#ffd4d4]
blur-3xl
rounded-full
"
/>


<div
className="
relative
bg-white/75
backdrop-blur-2xl
border
border-white/40
rounded-[35px]
p-8
shadow-[0_25px_70px_rgba(0,0,0,0.08)]
"
>

<div className="text-center">

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
shadow-md
text-3xl
mb-4
animate-bounce
"
>

⛩️

</div>

<h1
className="
font-serif
text-5xl
font-bold
leading-tight
"
>

Join FormVerse

</h1>

<p
className="
text-gray-500
mt-2
"
>

Create beautiful forms effortlessly

</p>

</div>


<form
onSubmit={handleSubmit(onSubmit)}
className="
mt-8
space-y-5
"
>

<div>

<label
className="
font-medium
text-sm
"
>

Full Name

</label>

<Input
placeholder="John Doe"
className="
mt-2
h-12
rounded-2xl
border-0
bg-[#faf6f3]
focus-visible:ring-[#ff7a7a]
"
{...register(
"name",
{
required:"Name required"
}
)}
/>

{errors.name&&(

<p className="text-red-500 text-xs mt-1">

{errors.name.message}

</p>

)}

</div>



<div>

<label
className="
font-medium
text-sm
"
>

Email

</label>

<Input
placeholder="hello@gmail.com"
className="
mt-2
h-12
rounded-2xl
border-0
bg-[#faf6f3]
"
{...register(
"email",
{
required:"Email required"
}
)}
/>

{errors.email&&(

<p className="text-red-500 text-xs mt-1">

{errors.email.message}

</p>

)}

</div>



<div>

<label
className="
font-medium
text-sm
"
>

Password

</label>

<Input
type="password"
className="
mt-2
h-12
rounded-2xl
border-0
bg-[#faf6f3]
"
{...register(
"password",
{
required:"Password required",
minLength:{
value:6,
message:"Minimum 6 characters"
}
}
)}
/>

{errors.password&&(

<p className="text-red-500 text-xs mt-1">

{errors.password.message}

</p>

)}

</div>



<div>

<label
className="
font-medium
text-sm
"
>

Confirm Password

</label>

<Input
type="password"
className="
mt-2
h-12
rounded-2xl
border-0
bg-[#faf6f3]
"
{...register(
"confirmPassword",
{
validate:(value)=>

value===watch("password")
||
"Passwords do not match"
}
)}
/>

{errors.confirmPassword&&(

<p className="text-red-500 text-xs mt-1">

{errors.confirmPassword.message}

</p>

)}

</div>


<Button
disabled={isPending}
type="submit"
className="
w-full
h-12
rounded-2xl
mt-4
bg-gradient-to-r
from-[#ff6b6b]
to-[#ff9090]
hover:scale-[1.02]
hover:shadow-lg
transition-all
duration-300
"
>

{
isPending
?
"Creating..."
:
"Create Account →"
}

</Button>


<div
className="
text-center
text-sm
text-gray-500
pt-2
"
>

Already have account?

<Link
href="/login"
className="
ml-2
font-semibold
text-[#ff6b6b]
hover:underline
"
>

Login

</Link>

</div>


</form>

</div>

</div>

)

}