import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { useState } from "react";
import ChatPage from "@/components/chatPage";

const Home: React.FC = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ChatPage user={user} />;
};

export default Home;
