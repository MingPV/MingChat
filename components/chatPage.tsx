"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

interface Message {
  id: string;
  user: string;
  message: string;
  created_at: string;
}

export default function ChatPage(user: any) {
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on<Message>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const sendMessage = async () => {
    // console.log(user.user.email);
    if (newMessage.trim() !== "") {
      const { error } = await supabase.from("messages").insert([
        {
          user: user?.user?.user_metadata?.display_name,
          message: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      }

      setNewMessage("");
      console.log(messages);
    }
  };

  return (
    // <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    //   <h1>Realtime Chat</h1>
    //   <div
    //     style={{
    //       border: "1px solid #ccc",
    //       padding: "10px",
    //       height: "300px",
    //       overflowY: "scroll",
    //     }}
    //   >
    //     {messages.map((msg) => (
    //       <div key={msg.id}>
    //         <strong>{msg.user}</strong>: {msg.message}
    //       </div>
    //     ))}
    //   </div>

    //   <input
    //     type="text"
    //     placeholder="Type your message..."
    //     value={newMessage}
    //     onChange={(e) => setNewMessage(e.target.value)}
    //     style={{ marginBottom: "10px", display: "block", width: "100%" }}
    //   />
    //   <button onClick={sendMessage} style={{ display: "block", width: "100%" }}>
    //     Send
    //   </button>
    // </div>
    <div>Chat</div>
  );
}
