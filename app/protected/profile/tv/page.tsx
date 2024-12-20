"use client";

import { useUser } from "@/context/UserContext";
import UserPostsType from "../UserPostsType";

export default function ProtectedPage() {
  const { user } = useUser();
  if (!user) return <p>Loading User</p>;
  return (
    <UserPostsType
      userId={user.id.toString()}
      currentUserId={user.id.toString()}
      media_type={"tv"}
    ></UserPostsType>
  );
}
