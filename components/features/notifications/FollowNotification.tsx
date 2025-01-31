import FollowButton from "@/components/features/posts/FollowButton";
import ProfilePicture from "@/components/ui/ProfilePicture";
import React from "react";

const FollowNotification = ({ notification }: any) => {
  const fromUser = notification.users;
  return (
    <div className="flex flex-row justify-between rounded-[8px] border border-foreground/10 bg-foreground/10 p-4">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <ProfilePicture user={fromUser}></ProfilePicture>
          <p className="">
            <span className="font-bold">{fromUser.username}</span> started
            following you!
          </p>
        </div>

        <FollowButton user_to_follow_id={fromUser.id}></FollowButton>
      </div>
    </div>
  );
};

export default FollowNotification;
