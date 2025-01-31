"use client";

import { IPost } from "@/types";
import React, { useEffect, useState, useMemo } from "react";
import SaveButton from "./SaveButton";
import Link from "next/link";
import ProfilePicture from "../../ui/ProfilePicture";
import UserReviewText from "./UserReviewText";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@/hooks/UserContext";
import PostStats from "./PostStats";
import { fetchMediaData } from "@/lib/client/fetchMediaData";
import { timeAgo } from "@/lib/utils";

const ErrorComponent = () => <div>Error loading post.</div>;

export function HomePostCard({ post, index }: any) {
  const media_id = post.media_id;
  const media_type = post.media_type;
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUser();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedMediaData = await fetchMediaData(media_type, media_id);
        if (isMounted) {
          setMedia(fetchedMediaData);
        }
      } catch (error) {
        console.error("Error fetching media data:", error);
        if (isMounted) {
          setError("Error fetching media data");
          setMedia(null);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [media_type, media_id]);

  const variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    [],
  );

  if (!currentUser) {
    return <p>no current user</p>;
  }

  const userId = currentUser.id;

  const creator = {
    id: post.creatorid,
    email: post.creator_email,
    image_url: post.creator_image_url,
    name: post.creator_name,
    username: post.creator_username,
  };

  if (!creator) {
    return <p>no creator</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-[8px] border border-foreground/10 bg-foreground/10"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.15,
        ease: "easeInOut",
        duration: 0.25,
      }}
      viewport={{ amount: 0 }}
    >
      <div className="relative flex w-[330px] max-w-[calc(100vw-10px)] flex-col">
        <div className="relative flex flex-col overflow-hidden rounded-xl">
          <div className="flex flex-row items-center justify-between gap-4 p-2">
            <div className="flex flex-row items-center gap-2">
              <span className="min-h-[35px] min-w-[35px]">
                <ProfilePicture user={creator} />
              </span>
              <div>
                <p className="line-clamp-1">
                  <span className="text-lg font-bold">{creator.username}</span>{" "}
                  watched{" "}
                  <span className="text-lg font-bold hover:underline">
                    <Link href={`/protected/media/${media_type}/${media_id}`}>
                      {media && (media.title || media.name)}
                    </Link>
                  </span>
                </p>
                <p className="text-sm opacity-50">{timeAgo(post.created_at)}</p>
              </div>
            </div>
            <div>
              {post.creatorid === userId && (
                <Link href={`/protected/edit-post/${post.id}`}>
                  <img
                    src="/assets/icons/ellipsis-solid.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="invert-on-dark min-h-[20px] min-w-[20px] justify-self-end opacity-80"
                  />
                </Link>
              )}
            </div>
          </div>
          <div className="relative my-auto flex flex-col gap-4">
            <div className="z-10 flex flex-col gap-2">
              <div className="mx-auto h-[480px] w-[320px]">
                {media && (
                  <div className="overflow-hidden rounded-[4px]">
                    <div className="absolute m-1 flex flex-row items-center justify-center gap-2 rounded-[4px] bg-background/30 p-1 px-2 text-lg font-bold backdrop-blur-xl">
                      <img
                        src="/assets/icons/star-solid.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="invert-on-dark"
                        loading="lazy"
                      />
                      <p>{post.vote_user}</p>
                    </div>
                    <Link href={`/protected/media/${media_type}/${media_id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
                        alt=""
                        width={320}
                        height={480}
                        className="mx-auto min-h-[480px] min-w-[320px]"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 pl-3 pt-4">
          <UserReviewText
            post_review={post.review_user || "no review"}
            creator_name={creator?.username || "no user"}
          />
        </div>
        <div className="flex w-full items-center p-2">
          <div className="align-center flex h-full w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <PostStats post={post} user={currentUser}></PostStats>
            </div>
            <div className="flex flex-row items-center gap-4">
              <SaveButton post={post} />
              <Link
                className=""
                href={`/protected/create-post/${media_type}/${media_id}`}
              >
                <img
                  src="/assets/icons/add-circle-outline.svg"
                  alt=""
                  width={30}
                  height={30}
                  className="invert-on-dark"
                />
              </Link>
              <Link
                className=""
                href={`/protected/create-post/${media_type}/${media_id}`}
              >
                <img
                  src="/assets/icons/share-solid.svg"
                  alt=""
                  width={30}
                  height={30}
                  className="invert-on-dark"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HomePostCard;
