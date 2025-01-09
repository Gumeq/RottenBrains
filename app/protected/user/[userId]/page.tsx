"use client";

import { useUser } from "@/context/UserContext";
import UserPosts from "../../profile/UserPosts";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;
  const { user: currentUser } = useUser();

  if (!currentUser) return <p>Loading User</p>;
  return (
    <UserPosts
      userId={userId}
      currentUserId={currentUser.id.toString()}
    ></UserPosts>
  );
}
