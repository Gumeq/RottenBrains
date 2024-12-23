"use client";

import { useUser } from "@/context/UserContext";
import UserPostsType from "@/app/protected/profile/UserPostsType";

export default function ProtectedPage({
  params,
}: {
  params: { userId: string };
}) {
  const { user: currentUser } = useUser();
  const userId = params.userId;

  if (!currentUser) return <p>Loading User</p>;
  return (
    <UserPostsType
      userId={userId}
      currentUserId={currentUser.id.toString()}
      media_type={"tv"}
    ></UserPostsType>
  );
}
