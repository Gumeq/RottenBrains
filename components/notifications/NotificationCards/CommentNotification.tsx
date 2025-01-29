"use client";
import ProfilePicture from "@/components/ProfilePicture";
import { getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CommentNotification = ({ notification }: any) => {
  const [media, setMedia] = useState<any>(null);
  const fromUser = notification.users;
  const media_type = notification.post_id?.media_type;
  const media_id = notification.post_id?.media_id;
  const comment = notification.comment_id;

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const details = await getMediaDetails(media_type, media_id);
        setMedia(details);
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    };

    fetchMediaDetails();
  }, [notification]);

  if (!media || !comment) {
    return;
  }

  return (
    <div className="flex flex-row justify-between rounded-[8px] border border-foreground/10 bg-foreground/10 p-2">
      <div className="flex w-full flex-row items-center">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <div className="flex h-full w-full flex-col items-start p-2">
            <div className="flex flex-row items-center gap-4">
              <div className="h-full">
                <ProfilePicture user={fromUser}></ProfilePicture>
              </div>
              <p className="">
                <span className="font-bold">
                  <Link href={`/protected/user/${fromUser.id}`}>
                    {fromUser.username}
                  </Link>
                </span>{" "}
                commented on your post about:
              </p>
            </div>
            <div className="flex h-full flex-row gap-4">
              <div className="h-full min-w-[35px]"></div>
              <div className="flex flex-col gap-2">
                <Link
                  className="text-lg font-bold hover:underline"
                  href={`/protected/media/${media_type}/${media_id}`}
                >
                  {media.title || media.name}
                </Link>
                <div className="max-w-[90%]">"{comment.content}"</div>
              </div>
            </div>
          </div>
          <div>
            <Link href={`/protected/media/${media_type}/${media_id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt="media_poster"
                width={100}
                height={150}
                className="min-h-[100px] min-w-[100px] rounded-[6px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentNotification;
