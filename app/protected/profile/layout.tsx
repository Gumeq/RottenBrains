import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import Tabs from "./tabs";
import ProfilePicture from "./ProfilePictureChange";
import FollowInfo from "../user/[userId]/FollowInfo";
import FollowButton from "@/components/post/FollowButton";
import ScrollButtons from "@/components/explore/ScrollButtons";
import HomeMediaCard from "../home/HomeMediaCard";
import Link from "next/link";
import NewTabs from "./NewTabs";
import MobileTopBarHome from "../home/MobileTopBarHome";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  let user = await getCurrentUser();
  if (!user) {
    return <p>Loading...</p>;
  }
  user = user.user;

  const dateString = user.created_at;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return (
    <>
      <MobileTopBarHome />
      <div className="mt-12 w-full lg:mx-auto lg:mt-0 lg:max-w-7xl lg:p-4">
        <div className="w-full">
          <div className="aspect-[5/1] w-full overflow-hidden lg:rounded-[16px]">
            <img
              src={user.backdrop_url}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex h-1/2 w-full flex-row gap-4">
            <div className="-mt-[50px] ml-4 lg:-mt-[75px]">
              <ProfilePicture></ProfilePicture>
            </div>
            <div className="h-full w-full">
              <div className="flex flex-col gap-2 pt-4 lg:gap-4">
                <div className="flex w-full flex-row flex-wrap gap-4 lg:justify-between">
                  <p className="text-2xl font-semibold">{user.username}</p>
                  <FollowButton user_to_follow_id={user.id}></FollowButton>
                </div>
                <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
                  {/* <p className="lowercase">@{user.username}</p> */}
                  <FollowInfo user={user}></FollowInfo>
                  <p className="text-sm text-foreground/50">
                    Member since {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 w-full lg:my-8">
            <NewTabs></NewTabs>
          </div>
          <div className="max-w-screen w-full px-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
