import { LoginForm } from "~/components/login-form";

export default function Page() {
  return (
    <main
      className="
      min-h-screen
      bg-[#f7f2ec]
      overflow-hidden
      relative
      "
    >

      <div
        className="
        absolute
        top-0
        left-0
        w-[350px]
        h-[350px]
        bg-[#ffdede]
        rounded-full
        blur-[150px]
        opacity-50
        "
      />

      <div
        className="
        absolute
        bottom-0
        right-0
        w-[350px]
        h-[350px]
        bg-[#ffe7c8]
        rounded-full
        blur-[150px]
        opacity-50
        "
      />

      <div
        className="
        max-w-7xl
        mx-auto
        min-h-screen
        px-6
        grid
        lg:grid-cols-2
        items-center
        gap-20
        relative
        z-10
        "
      >

        {/* LEFT */}

        <div className="hidden lg:flex flex-col gap-8">

          <div
            className="
            px-5
            py-3
            rounded-full
            bg-[#ffeaea]
            text-[#ff6b6b]
            w-fit
            font-medium
            "
          >
            ✨ Welcome Back
          </div>

          <h1
            className="
            text-7xl
            font-serif
            font-bold
            leading-tight
            "
          >
            Login and
            <br />

            <span className="text-[#ff6b6b]">
              continue creating
            </span>

          </h1>

          <p
            className="
            text-gray-500
            text-xl
            leading-9
            max-w-xl
            "
          >
            Access your dashboard,
            manage forms and track responses.
          </p>

        </div>

        {/* RIGHT */}

        <div className="flex justify-center">

          <LoginForm />

        </div>

      </div>

    </main>
  );
}