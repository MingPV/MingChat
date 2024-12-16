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
      <div className="flex flex-1 bg-neutral-200 rounded-xl">
        {friends ? (
          <div className="bg-neutral-200  flex flex-row flex-1 rounded-xl m-3">
            <ul className=" flex flex-col gap-6 w-96 ">
              {friends?.map((friend: any) => (
                <li
                  className="bg-neutral-600 text-slate-100 p-5 flex flex-col cursor-pointer rounded-xl"
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
            {selectedFriend ? (
              <Chat
                user={user}
                friend={selectedFriend}
                friend_name={selectedFriendName}
              />
            ) : null}
          </div>
        ) : (
          <div>you have no friends</div>
        )}
      </div>
    </>
  );
}
