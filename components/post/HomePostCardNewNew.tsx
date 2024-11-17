"use client";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture";
import { timeAgo } from "./TimeAgo";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@/context/UserContext";
import PostStats from "./PostStats";
import UserReviewTextNew from "./UserReviewTextNew";
import MoreOptions from "@/app/protected/home/MoreOptions";

const ErrorComponent = () => <div>Error loading post.</div>;

export function HomePostCardNewNew({ post, index }: any) {
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
          console.log(fetchedMediaData);
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
  if (loading || !currentUser) {
    return (
      <motion.div
        className="relative flex h-min flex-col rounded-[8px] border border-foreground/10 bg-white/5 p-2 lg:min-w-[400px] lg:max-w-[550px]"
        initial="hidden"
        animate="visible"
        transition={{
          delay: index * 0.15,
          ease: "easeInOut",
          duration: 0.25,
        }}
        viewport={{ amount: 0 }}
      >
        <div className="mb-2 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <span className="min-h-[35px] min-w-[35px]">
              <Skeleton
                circle={true}
                height={35}
                width={35}
                baseColor="rgba(255, 255, 255, 0.1)" // Custom opacity color
              />
            </span>
            <div>
              <Skeleton
                width={120}
                height={20}
                baseColor="rgba(255, 255, 255, 0.1)"
              />
              <Skeleton
                width={80}
                height={16}
                baseColor="rgba(255, 255, 255, 0.1)"
              />
            </div>
          </div>
          <div className="flex h-full flex-row items-center gap-2">
            <Skeleton
              width={40}
              height={20}
              baseColor="rgba(255, 255, 255, 0.1)"
            />
            <Skeleton
              width={60}
              height={30}
              baseColor="rgba(255, 255, 255, 0.1)"
            />
          </div>
        </div>
        <div className="flex w-full flex-row justify-between gap-4">
          <Skeleton
            width={154}
            height={231}
            className="rounded-[6px]"
            baseColor="rgba(255, 255, 255, 0.1)"
          />
          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton
                width="100%"
                height={20}
                baseColor="rgba(255, 255, 255, 0.1)"
              />
              <Skeleton
                width="100%"
                height={20}
                baseColor="rgba(255, 255, 255, 0.1)"
              />
              <Skeleton
                width="80%"
                height={20}
                baseColor="rgba(255, 255, 255, 0.1)"
              />
            </div>
            <div className="flex w-full items-center">
              <div className="align-center flex h-full w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <Skeleton
                    width={60}
                    height={20}
                    baseColor="rgba(255, 255, 255, 0.1)"
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Skeleton
                    circle={true}
                    height={32}
                    width={32}
                    baseColor="rgba(255, 255, 255, 0.1)"
                  />
                  <Skeleton
                    circle={true}
                    height={32}
                    width={32}
                    baseColor="rgba(255, 255, 255, 0.1)"
                  />
                  <Skeleton
                    circle={true}
                    height={32}
                    width={32}
                    baseColor="rgba(255, 255, 255, 0.1)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const userId = currentUser.id;

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path || media.backdrop_path;

  let genreIds = [];
  if (media?.genres && Array.isArray(media.genres)) {
    genreIds = media.genres.map((genre: any) => genre.id);
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <motion.div
      className="relative flex h-min flex-col rounded-[8px] border border-foreground/10 bg-white/5 lg:max-w-[400px]"
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
      <div className="flex flex-row items-center justify-between gap-4 px-4 py-2">
        <div className="flex flex-row items-center gap-2">
          <span className="min-h-[32px] min-w-[32px]">
            <ProfilePicture user={creator} />
          </span>
          <div>
            <p className="line-clamp-1 font-bold">
              <Link href={`/protected/user/${creator.id}`}>
                {creator.username}
              </Link>
            </p>
            <p className="text-xs opacity-50">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        <div className="flex h-full flex-row items-center gap-2">
          {post.creatorid === userId && (
            <Link href={`/protected/edit-post/${post.post_id}`}>
              <img
                src="/assets/icons/ellipsis-solid.svg"
                alt=""
                width={20}
                height={20}
                className="invert-on-dark mr-2 min-h-[20px] min-w-[20px] justify-self-end"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col justify-between">
        <div className="relative w-full">
          <Link href={`/protected/media/${media_type}/${media_id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
              alt=""
              className="aspect-[16/9] w-full"
            />
          </Link>
          <div className="absolute bottom-2 right-2">
            <p
              className={`rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white`}
            >
              {post.vote_user}/10
            </p>
          </div>
        </div>

        <div className="flex flex-col px-2 lg:px-4">
          <div className="flex flex-col gap-2 py-4">
            <div className="flex w-full flex-row gap-2">
              <img
                src={`/assets/icons/${media_type}-outline.svg`}
                alt=""
                className="invert-on-dark"
              />
              <Link
                href={`/protected/media/${media_type}/${media_id}`}
                className="font-bold"
              >
                {media && (media.title || media.name)}
              </Link>
            </div>
            <UserReviewTextNew
              post_review={post.review_user || "no review"}
              creator_name={creator?.username || "no user"}
            />
          </div>
          <div className="flex w-full flex-col justify-between py-2">
            <div className="flex w-full items-center">
              <div className="align-center flex h-full w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <PostStats post={post} user={currentUser}></PostStats>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <MoreOptions
                    user_id={userId.toString()}
                    media_type={media_type}
                    media_id={media_id}
                    genre_ids={genreIds}
                  ></MoreOptions>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HomePostCardNewNew;
