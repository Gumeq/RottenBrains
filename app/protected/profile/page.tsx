import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import Tabs from "./tabs";
import ProfilePicture from "./ProfilePictureChange";
import FollowInfo from "../user/[userId]/FollowInfo";
import FollowButton from "@/components/post/FollowButton";
import { getWatchHistoryForUser } from "@/utils/supabase/queries";
import ScrollButtons from "@/components/explore/ScrollButtons";
import HomeMediaCard from "../home/HomeMediaCard";
import Link from "next/link";

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

  const watchHistory = await getWatchHistoryForUser(user.user.id, 20, 0);

  return (
    <div className="mx-auto max-w-7xl p-1 lg:mt-0 lg:p-4">
      {user && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-4 lg:py-0">
          <div className="flex aspect-[5/1] w-full overflow-hidden rounded-[16px]">
            <img
              src={user.user.backdrop_url}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-between py-2 md:flex-row">
            <div className="flex flex-row items-center gap-4">
              <ProfilePicture></ProfilePicture>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-2xl font-bold lg:text-4xl">
                    {user.user.username}
                  </p>
                  <Link href={"/protected/settings"}>
                    <img
                      src="/assets/icons/settings-outline.svg"
                      alt=""
                      className="invert-on-dark"
                    />
                  </Link>
                </div>

                <FollowInfo user={user.user}></FollowInfo>
                <p className="text-sm text-foreground/50">
                  Member since {formattedDate}
                </p>
                <FollowButton user_to_follow_id={user.user.id}></FollowButton>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-4 h-[1px] w-full bg-foreground/10"></div>
      <div className="mt-16 lg:mt-0">
        <div className="mb-4 flex flex-row items-center justify-between px-2 lg:p-0">
          <div className="flex flex-row items-center gap-2">
            <img
              src="/assets/icons/history.svg"
              alt=""
              width={24}
              height={24}
              className="invert-on-dark"
            />
            <h2 className="text-xl font-bold">Recently watched</h2>
          </div>
          <ScrollButtons containerId="watch_history_main"></ScrollButtons>
        </div>
        <div
          className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto px-2 lg:px-0"
          id={"watch_history_main"}
        >
          {watchHistory &&
            watchHistory.slice(0, 20).map((media: any) => {
              return (
                <div className="inline-block h-auto w-[80vw] flex-shrink-0 lg:inline lg:w-auto">
                  <HomeMediaCard
                    user_id={user.user.id}
                    media_type={media.media_type}
                    media_id={media.media_id}
                    season_number={media.season_number}
                    episode_number={media.episode_number}
                  ></HomeMediaCard>
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-4 flex w-full items-center">
        <Tabs user={user.user}></Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
