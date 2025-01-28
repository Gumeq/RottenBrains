import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser, getUserFromDB } from "@/utils/supabase/serverQueries";
import React from "react";
import FollowButton from "@/components/post/FollowButton";
import ScrollButtons from "@/components/explore/ScrollButtons";
import Link from "next/link";
import MobileTopBarHome from "../../home/MobileTopBarHome";
import FollowInfo from "./FollowInfo";
import NewTabs from "./NewTabs";

type Params = Promise<{ userId: string }>;

const ProfileLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) => {
  const { userId } = await params;
  let user = await getUserFromDB(userId);
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
      <div className="mx-auto mt-12 w-screen max-w-[100vw] lg:mt-0 lg:max-w-7xl lg:p-4">
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
              <img
                src={user.image_url}
                alt="Profile"
                className="overlay-hidden aspect-[1/1] w-[100px] min-w-[100px] rounded-full lg:w-[150px] lg:min-w-[150px]"
              />
            </div>
            <div className="h-full w-full">
              <div className="flex flex-col pt-4">
                <div className="flex w-full flex-row flex-wrap gap-2 lg:justify-between">
                  <p className="text-2xl font-semibold">{user.username}</p>
                  <FollowButton user_to_follow_id={user.id}></FollowButton>
                </div>
                <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
                  <p className="lowercase">@{user.username}</p>
                  <FollowInfo user={user}></FollowInfo>
                  <p className="text-sm text-foreground/50">
                    Member since {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 w-full lg:my-8">
            <NewTabs user_id={user.id.toString()}></NewTabs>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
