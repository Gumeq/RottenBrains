
import { useUser } from "@/context/UserContext";
import UserPostsType from "@/app/protected/profile/UserPostsType";
import UserWatchHistory from "@/app/protected/profile/UserWatchHistory";

type Params = Promise<{ userId: string }>;
export default async function ProtectedPage({ params }: { params: Params }) {
  const { userId } = await params;

  return (
    <UserWatchHistory
      userId={userId}
    ></UserWatchHistory>
  );
}
