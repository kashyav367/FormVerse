import { SignupForm } from "~/components/signup-form";

export default function SignupPage() {
  return (
    <main
      className="
      min-h-screen
      bg-[#f7f2ec]
      overflow-hidden
      relative
      "
    >

      {/* blur background */}

      <div
        className="
        absolute
        top-0
        left-0
        w-[400px]
        h-[400px]
        bg-[#ffdede]
        rounded-full
        blur-[150px]
        opacity-40
        "
      />

      <div
        className="
        absolute
        bottom-0
        right-0
        w-[400px]
        h-[400px]
        bg-[#ffe7c8]
        rounded-full
        blur-[150px]
        opacity-40
        "
      />

      <div
        className="
        max-w-7xl
        mx-auto
        min-h-screen
        px-6
        relative
        z-10
        "
      >

        <div
          className="
          grid
          lg:grid-cols-2
          min-h-screen
          items-center
          gap-20
          "
        >

          {/* LEFT */}

          <div
            className="
            hidden
            lg:flex
            flex-col
            gap-10
            "
          >

            <div
              className="
              px-5
              py-3
              rounded-full
              bg-[#ffeaea]
              text-[#ff6b6b]
              w-fit
              text-lg
              font-medium
              "
            >
              ✨ Join FormVerse
            </div>

            <h1
              className="
              text-7xl
              font-bold
              font-serif
              leading-tight
              "
            >
              Create forms
              <br />

              <span className="text-[#ff6b6b]">
                beautifully
              </span>

            </h1>

            <p
              className="
              text-gray-500
              max-w-xl
              text-xl
              leading-10
              "
            >
              Build beautiful forms,
              collect responses,
              and manage everything
              in one powerful workspace.
            </p>

            <div className="flex gap-6">

              <div
                className="
                bg-white
                rounded-[30px]
                p-8
                shadow-xl
                "
              >

                <h2
                  className="
                  text-5xl
                  font-bold
                  "
                >

                  500k+

                </h2>

                <p className="text-gray-500">

                  Forms created

                </p>

              </div>


              <div
                className="
                bg-white
                rounded-[30px]
                p-8
                shadow-xl
                "
              >

                <h2
                  className="
                  text-5xl
                  font-bold
                  "
                >

                  10k+

                </h2>

                <p className="text-gray-500">

                  Creators joined

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div
            className="
            flex
            justify-center
            items-center
            "
          >

            <SignupForm />

          </div>

        </div>

      </div>

    </main>
  );
}