"use client";
import { trpc } from "~/trpc/client";

export default  function Home() {
  const { data } = trpc.chaicode.useQuery({name :  "Ankit", email: 'p@e.com' ,age: 30});

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl"></h1>
        <h2>Server Message: {data?.message}</h2>
      </div>
    </main>
  );
}
