"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function FriendPage(props: any) {
  const friends = props.friends;
  const user = props.user;
  const friend_status = props.friend_status;

  console.log(friend_status);
  console.log(friends);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSerachResult] = useState(Array);
  const [newFriend, setNewFriend] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSearch = async () => {
    // You can query your user table for matching usernames or emails
    const { data, error } = await supabase
      .from("users")
      .select("uid, username, email")
      .ilike("username", `%${searchQuery}%`);

    if (error) {
      setMessage("Error searching for friends");
    } else {
      setMessage("");
      setSerachResult(data);
      console.log(data); // Display the search results
    }
    console.log("Banaaaaa");
    console.log(data);
  };

  const addFriend = async (friendUid: any, friend_name: any) => {
    console.log(`sending request to ${friendUid}`);
    console.log(user);
    console.log("testttttttttttttt");
    console.log(friend_name);
    const { data, error } = await supabase.rpc("insert_friends_with_request", {
      uid: user.user.id,
      f_uid: friendUid,
      since: new Date(),
      my_name: user.user.user_metadata.display_name,
      friend_name: friend_name,
    });

    if (error) {
      console.error("Transaction failed:", error.message);
    } else {
      console.log("Transaction successful:", data);
    }
  };

  const accpetFriendRequest = async (friendUid: any) => {
    console.log(`accepting`);
    console.log(user);
    const { data, error } = await supabase.rpc("accept_friend_request", {
      my_uid: user.user.id,
      friend_uid: friendUid,
      accepted_since: new Date(),
    });

    if (error) {
      console.error("accept friend request failed:", error.message);
    } else {
      console.log("accepted friend request:", data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-neutral-300 px-16 py-10 rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Your Friends
      </h1>
      <ul className="space-y-4">
        {friends.map((friend: any) => (
          <li
            key={friend.f_uid}
            className="flex justify-between items-center p-4 border border-gray-200 bg-neutral-200 rounded-lg shadow-sm"
          >
            <span className="font-medium text-neutral-600">
              {friend.friend_name}
            </span>
            <span className="text-sm text-gray-500">
              Since: {new Date(friend.since).toLocaleDateString()}
            </span>
            {!friend.is_accepted ? (
              friend.status == "receiving" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition rounded-xl"
                  onClick={(e: any) => {
                    accpetFriendRequest(friend.f_uid);
                    e.target.style.display = "none";
                  }}
                >
                  Accept
                </button>
              ) : (
                <div className="text-sm text-gray-500">Requested</div>
              )
            ) : null}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Search for Friends
      </h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter friend's name"
          className="px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-neutral-600 rounded-xl"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-neutral-700 text-white  hover:bg-neutral-600 transition rounded-xl"
        >
          Search
        </button>
      </div>

      {message && <p className="mt-2 text-red-500">{message}</p>}

      <ul className="space-y-4 mt-4">
        {searchResult.map((result: any) => (
          <li
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-neutral-400"
            key={result.uid}
          >
            <span className="font-medium">{result.username}</span>
            {friend_status[result.uid] == "accepted" ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => redirect("/")}
              >
                Chat
              </button>
            ) : result.uid == user.user.id ? (
              <button
                className="px-4 py-2 bg-neutral-600 text-white rounded-lg cursor-not-allowed"
                disabled
              >
                You
              </button>
            ) : friend_status[result.uid] == "sending" ? (
              <button
                className="px-4 py-2 bg-neutral-600 text-white rounded-lg cursor-not-allowed"
                disabled
              >
                Requested
              </button>
            ) : friend_status[result.uid] == "receiving" ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600transition"
                onClick={(e: any) => {
                  if (e.target.innerText == "Accept") {
                    accpetFriendRequest(result.uid);
                    e.currentTarget.innerText = "Chat";
                  } else if (e.target.innerText == "Chat") {
                    console.log("chat");
                  }
                }}
              >
                Accept
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600transition"
                onClick={(e: any) => {
                  addFriend(result.uid, result.username);
                  e.currentTarget.innerText = "Requested";
                  e.target.disabled = true;
                }}
              >
                Add Friend
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
