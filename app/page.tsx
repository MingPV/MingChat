import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  return (
    <>
      <main className="bg-teal-800 flex flex-col flex-1">
        <div className="flex flex-col flex-1 justify-center items-center bg-teal-700">
          <div>Hello !!</div>
          {user ? null : <div>Please sign-in to use my website.</div>}
        </div>
      </main>
    </>
  );
}
