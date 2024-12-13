"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FriendPage(props: any) {
  const friends = props.friends;
  const user = props.user;
  const friend_status = props.friend_status;

  console.log(friend_status);

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
  };

  const addFriend = async (friendUid: any) => {
    console.log(`sending request to ${friendUid}`);
    console.log(user);
    const { data, error } = await supabase.rpc("insert_friends_with_request", {
      uid: user.user.id,
      f_uid: friendUid,
      since: new Date(),
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
    <div>
      <h1>Your Friends</h1>
      <ul>
        {friends.map((friend: any) => (
          <li key={friend.f_uid}>
            Friend UID: {friend.f_uid} Since:{" "}
            {new Date(friend.since).toLocaleDateString()}{" "}
            {!friend.is_accepted ? (
              friend.status == "receiving" ? (
                <button
                  className="border hover: "
                  onClick={(e: any) => {
                    accpetFriendRequest(friend.f_uid);
                    e.target.style.display = "none";
                  }}
                >
                  Accept
                </button>
              ) : (
                <div>requested</div>
              )
            ) : null}
          </li>
        ))}
      </ul>

      <h2>Search for Friends</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter friend's name"
      />
      <button onClick={handleSearch}>Search</button>

      {message && <p>{message}</p>}

      <ul>
        {searchResult.map((result: any) => (
          <li className="flex flex-row gap-2" key={result.uid}>
            Username: {result.username}
            {friend_status[result.uid] == "accepted" ? (
              <button
                className="border hover: px-1"
                onClick={() => console.log("chat")}
              >
                Chat
              </button>
            ) : result.uid == user.user.id ? (
              <button className="border hover: px-1" disabled>
                You
              </button>
            ) : friend_status[result.uid] == "sending" ? (
              <button className="border hover: px-1">requested</button>
            ) : friend_status[result.uid] == "receiving" ? (
              <button
                className="border hover: px-1"
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
                className="border hover: px-1"
                onClick={(e: any) => {
                  addFriend(result.uid);
                  e.currentTarget.innerText = "requested";
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
