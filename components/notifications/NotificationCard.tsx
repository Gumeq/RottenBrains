"use client";

import CommentNotification from "./NotificationCards/CommentNotification";
import FollowNotification from "./NotificationCards/FollowNotification";
import LikeNotification from "./NotificationCards/LikeNotification";

const NotificationCard = ({ notification }: { notification: any }) => {
  const fromUser = notification.users;

  if (!fromUser) {
    return <p>no user</p>; // or a loading spinner
  }

  const action = notification.type;
  if (action === "follow") {
    return (
      <FollowNotification notification={notification}></FollowNotification>
    );
  } else if (action === "like") {
    return <LikeNotification notification={notification}></LikeNotification>;
  } else if (action === "comment") {
    return (
      <CommentNotification notification={notification}></CommentNotification>
    );
  }

  return (
    // <div className="rounded-xl bg-foreground/5 p-4 flex flex-row justify-between">
    // 	<div className="flex flex-row items-center gap-4">
    // 		<ProfilePicture userId={fromUser.id}></ProfilePicture>
    // 		<p>
    // 			<span className="font-bold">{fromusername}</span>{" "}
    // 			{action === "liked"
    // 				? "liked your post"
    // 				: "started following you"}
    // 		</p>
    // 	</div>
    // </div>
    <div></div>
  );
};

export default NotificationCard;
