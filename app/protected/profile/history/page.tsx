"use client";

import { useUser } from "@/context/UserContext";
import UserPostsType from "../UserPostsType";
import UserWatchHistory from "../UserWatchHistory";

export default function ProtectedPage() {
  const { user } = useUser();
  if (!user) return <p>Loading User</p>;
  return (
    <UserWatchHistory
      userId={user.id.toString()}
      currentUserId={user.id.toString()}
    ></UserWatchHistory>
  );
}
