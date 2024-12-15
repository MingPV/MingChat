"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

interface Message {
  id: string;
  room_id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export default function ChatRoom(props: any) {
  const user_a_id = props.user.id;
  const user_b_id = props.friend;
  const friend_name = props.friend_name;
  console.log(props);
  console.log("Mingming");
  console.log(user_b_id);
  console.log(friend_name);
  console.log("Mingming");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const sortedIds = [user_a_id, user_b_id].sort(); // Ensure the IDs are sorted
  const roomId = `chat-room:${sortedIds[0]}:${sortedIds[1]}`; // Generate consistent roomId

  useEffect(() => {
    // Fetch initial messages from the database (optional, for persistence)
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (error) console.error("Error fetching messages:", error);
      else setMessages(data);
      console.log(roomId);
      console.log(data);
    };
    fetchMessages();

    // Subscribe to the channel for real-time updates
    const channel = supabase.channel(roomId);

    channel
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Subscribed to room: ${roomId}`);
        }
      });

    // Cleanup the channel on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Send a message
  const sendMessage = async () => {
    const messagePayload = {
      sender_id: user_a_id,
      receiver_id: user_b_id,
      message: newMessage,
      created_at: new Date().toISOString(), // Add timestamp
    };

    // Broadcast the message in real-time
    await supabase.channel(roomId).send({
      type: "broadcast",
      event: "message",
      payload: messagePayload,
    });

    // Save the message to the database (optional for persistence)
    await supabase.from("messages").insert([
      {
        room_id: roomId,
        sender_id: user_a_id,
        receiver_id: user_b_id,
        message: newMessage,
      },
    ]);

    setNewMessage(""); // Clear the input field
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat Room</h1>
      <div className="border border-gray-300 rounded-lg p-4 h-96 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender_id === user_a_id
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            <strong>{msg.sender_id === user_a_id ? "You" : "Them"}:</strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
