import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import Tabs from "./tabs";
import ProfilePicture from "./ProfilePictureChange";
// import ConnectButton from "@/utils/tmdb/ConnectButton";
import FollowInfo from "../user/[userId]/FollowInfo";
import FollowButton from "@/components/post/FollowButton";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  const dateString = user?.user.created_at;
  const date = new Date(dateString);
  // Create a formatter for the desired format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return (
    <div className="mx-auto mt-16 max-w-6xl">
      {user && (
        <div className="mx-auto flex max-w-2xl items-center justify-center py-4">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center justify-between gap-8">
              <div>
                <ProfilePicture></ProfilePicture>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-bold">{user.user.username}</p>
                <p className="text-md text-foreground/50">
                  Member since {formattedDate}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8">
              <div>
                <FollowInfo user={user.user}></FollowInfo>
              </div>
              <div className="flex flex-row gap-2">
                <FollowButton user_to_follow_id={user.user.id}></FollowButton>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center">
        <Tabs></Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
