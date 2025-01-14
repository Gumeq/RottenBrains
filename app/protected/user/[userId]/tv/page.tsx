import { useUser } from "@/context/UserContext";
import UserPostsType from "@/app/protected/profile/UserPostsType";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;

  return <UserPostsType userId={userId} media_type={"tv"}></UserPostsType>;
}
