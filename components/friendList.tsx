"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Chat from "./chat";

export default function FriendList(props: any) {
  const user = props.user;
  const friends = props.friends;

  const [selectedFriend, setSelectedFriend] = useState("");
  const [selectedFriendName, setSelectedFriendName] = useState("");

  console.log("sssssssssssssssssssssss");
  console.log(props);

  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has friends
    if (!user) {
      setIsFirstTime(true); // If no user, show login option
    } else if (friends.length === 0) {
      setIsFirstTime(false); // If no friends, show button to go to friend page
    }
  }, [user, friends]);

  const handleGoToFriendPage = () => {
    redirect("/friend");
  };
  return (
    <>
      <div className="flex flex-1 bg-neutral-600 rounded-xl">
        {friends ? (
          <div className="bg-neutral-600  flex flex-row flex-1 rounded-xl m-3">
            <ul className=" flex flex-col gap-6 w-96 ">
              {friends?.map((friend: any) => (
                <li
                  className={`bg-neutral-700 text-slate-100 p-5 flex flex-col cursor-pointer rounded-xl ${friend.is_accepted ? null : "hidden"}`}
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
          <div className="bg-neutral-600 w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Welcome to Our Web!</h1>
              {isFirstTime ? (
                <div>
                  <p className="text-xl mb-4">Please log in to get started.</p>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => redirect("/sign-in")}
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xl mb-4">
                    You don't have any friends yet.
                  </p>
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={handleGoToFriendPage}
                  >
                    Go to Friends Page
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
