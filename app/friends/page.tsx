import { createClient } from "@/utils/supabase/server";
import FriendPage from "@/components/friendPage";

export default async function FriendsPage() {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // Fetch friends from the friends table
  const { data: friends, error: friendsError } = await supabase
    .from("friends")
    .select("uid, f_uid, since, status, is_accepted, friend_name")
    .eq("uid", user.user.id);

  if (friendsError) {
    console.log(user.user.user_metadata.uid);
    console.log(friends);
    console.error("Error fetching friends:", friendsError);
  }

  console.log(friends);

  const friend_status: Record<string, string> = {};

  const initializeFriendDict = () => {
    friends?.forEach((friend) => {
      if (friend.uid) {
        friend_status[friend.f_uid] = friend.status;
      } else {
        console.error("error when initialize friend_status");
      }
    });
  };

  initializeFriendDict();

  return (
    <FriendPage friends={friends} user={user} friend_status={friend_status} />
  );
}
