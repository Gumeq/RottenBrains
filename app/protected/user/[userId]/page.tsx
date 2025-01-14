import { useUser } from "@/context/UserContext";
import UserPosts from "../../profile/UserPosts";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;

  return <UserPosts userId={userId}></UserPosts>;
}
