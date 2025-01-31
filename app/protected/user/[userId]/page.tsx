import UserPosts from "@/components/features/profile/UserPosts";
import { useUser } from "@/hooks/UserContext";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;

  return <UserPosts userId={userId}></UserPosts>;
}
