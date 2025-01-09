"use client";

import { useUser } from "@/context/UserContext";
import UserPostsType from "@/app/protected/profile/UserPostsType";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;
  const { user: currentUser } = useUser();

  if (!currentUser) return <p>Loading User</p>;
  return (
    <UserPostsType
      userId={userId}
      currentUserId={currentUser.id.toString()}
      media_type={"movie"}
    ></UserPostsType>
  );
}
