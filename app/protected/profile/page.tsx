"use client";

import { useUser } from "@/context/UserContext";
import UserPosts from "./UserPosts";

export default function ProtectedPage() {
  const { user } = useUser();
  if (!user) return <p>Loading User</p>;
  return <UserPosts userId={user.id.toString()}></UserPosts>;
}
