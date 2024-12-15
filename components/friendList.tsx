"use client";

import { useState } from "react";
import Chat from "./chat";

export default function FriendList(props: any) {
  const user = props.user;
  const friends = props.friends;

  const [selectedFriend, setSelectedFriend] = useState("");
  const [selectedFriendName, setSelectedFriendName] = useState("");

  console.log("sssssssssssssssssssssss");
  console.log(props);
  return (
    <>
      <div className="bg-amber-100 flex flex-col min-w-[400px]">
        <div>
          {friends ? (
            <>
              <ul className="bg-amber-400 flex flex-col gap-6">
                {friends?.map((friend: any) => (
                  <li
                    className="bg-amber-200 text-slate-700 p-2 flex flex-col cursor-pointer"
                    key={friend.f_uid}
                    onClick={() => {
                      console.log("chat");
                      setSelectedFriend(friend.f_uid);
                      setSelectedFriendName(friend.friend_name);
                    }}
                  >
                    Friend Name: {friend.friend_name}
                  </li>
                ))}
              </ul>
              <div>{selectedFriend}</div>
              {selectedFriend ? (
                <Chat
                  user={user}
                  friend={selectedFriend}
                  friend_name={selectedFriendName}
                />
              ) : null}
            </>
          ) : (
            <div>you have no friends</div>
          )}
        </div>
      </div>
    </>
  );
}
