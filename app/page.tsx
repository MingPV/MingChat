import FriendList from "@/components/friendList";
import Chat from "@/components/chat";
import { createClient } from "@/utils/supabase/server";
import ChatPage from "@/components/chatPage";
import Loading from "@/components/loading";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  var friends = null;

  if (user) {
    // Fetch friends from the friends table
    const { data, error: friendsError } = await supabase
      .from("friends")
      .select("uid, f_uid, since, status, is_accepted,friend_name")
      .eq("uid", user?.id);

    if (friendsError) {
      console.error("Error fetching friends:", friendsError);
    }
    friends = data;
    console.log("paaaaaaaaaaaaaaaaaaa");
    console.log(user.id);
    console.log(friends);
  }

  return (
    <>
      <main className="flex flex-col flex-1">
        <div className="flex flex-row flex-1">
          <FriendList user={user} friends={friends} />
        </div>
      </main>
    </>
  );
}
