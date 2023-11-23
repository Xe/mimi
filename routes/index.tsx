import { Button } from "@/components/Button.tsx";
import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/img/mimi/happy.png"
          width="256"
          height="256"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Mimi</h1>
        <p class="my-4">
          Xe's integration bot.
        </p>
        <Button href={`/${ulid()}`}>Chat</Button>
      </div>
    </div>
  );
}
