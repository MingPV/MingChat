"use client";

import { useState, useEffect, useRef } from "react";
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
  const [messageCount, setMessageCount] = useState(0);
  const sortedIds = [user_a_id, user_b_id].sort(); // Ensure the IDs are sorted
  const roomId = `chat-room:${sortedIds[0]}:${sortedIds[1]}`; // Generate consistent roomId

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const isBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setIsAtBottom(isBottom);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching messages:", error);
    else setMessages(data);
    if (messages.length > messageCount) {
      // scrollToBottom();
    }
    setMessageCount(data?.length || 0);
    console.log(roomId);
    console.log(data);
  };

  useEffect(() => {
    // Fetch initial messages from the database (optional, for persistence)

    console.log("effecttttttttttttttt");

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

    // scrollToBottom();

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

    // scrollToBottom();
  };

  return (
    <div className="flex flex-col p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-center text-slate-100">
        {friend_name}
      </h1>
      <div
        className="border border-neutral-700 rounded-l-xl p-4 h-[55vh] overflow-y-auto flex flex-col-reverse gap-2 "
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages
          .slice()
          .reverse()
          .map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-xs break-words ${
                msg.sender_id === user_a_id
                  ? "bg-cyan-900  text-white self-end rounded-xl"
                  : "bg-neutral-300 text-gray-800 self-start rounded-xl"
              }`}
            >
              <strong>
                {msg.sender_id === user_a_id ? "" : friend_name + " :"}
              </strong>{" "}
              {msg.message}
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex mt-4 space-x-2 flex-1">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newMessage.trim()) {
              sendMessage();
              e.preventDefault(); // Prevents new line in textarea
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-neutral-700 focus:outline-none focus:ring focus:ring-neutral-500 bg-neutral-500 rounded-xl text-left align-top resize-none"
          rows={3} // Adjust the number of rows as needed
        />
        <div>
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 focus:outline-none focus:ring focus:ring-neutral-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
