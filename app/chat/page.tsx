import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { useState } from "react";
import ChatPage from "@/components/chatPage";

const Home: React.FC = () => {
  return <ChatPage />;
};

export default Home;
