"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import PostSkeleton from "./PostSkeleton";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  images?: {
    backdrops?: { file_path: string }[];
  };
  genres?: { id: bigint; name: string }[];
}

interface Creator {
  id: number;
  email: string;
  image_url: string;
  name: string;
  username: string;
}

interface Post {
  post_id: string;
  media_id: number;
  media_type: string;
  creatorid: number;
  creator_email: string;
  creator_image_url: string;
  creator_name: string;
  creator_username: string;
  created_at: string;
  vote_user: number;
  review_user: string;
  total_likes: number;
  has_liked: boolean;
  total_comments: number;
}

interface HomePostCardProps {
  post: Post;
}

const ErrorComponent = () => <div>Error loading post.</div>;

const HomePostCard = ({ post }: HomePostCardProps) => {
  const { media_id, media_type } = post;
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUser();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedMediaData = await fetchMediaData(media_type, media_id);
        setMedia(fetchedMediaData);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching media data:", error);
          setError("Error fetching media data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [media_type, media_id]);

  const variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    [],
  );

  const creator: Creator = {
    id: post.creatorid,
    email: post.creator_email,
    image_url: post.creator_image_url,
    name: post.creator_name,
    username: post.creator_username,
  };

  if (!creator) {
    return <p>No creator</p>;
  }

  if (loading || !currentUser) {
    return <PostSkeleton variants={variants} />;
  }

  const userId = currentUser.id.toString();

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path || media?.backdrop_path || "";

  const genreIds = media?.genres?.map((genre) => genre.id) || [];

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <motion.div
      className="relative flex h-min flex-col rounded-[8px] border border-foreground/10 bg-white/5 lg:min-w-[320px] lg:max-w-[400px]"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        ease: "easeInOut",
        duration: 0.25,
      }}
      viewport={{ amount: 0 }}
    >
      <PostHeader creator={creator} post={post} userId={userId} />
      <PostMedia
        media={media}
        media_type={media_type}
        media_id={media_id}
        imageUrl={imageUrl}
        post={post}
      />
      <PostContent
        media={media}
        media_type={media_type}
        media_id={media_id}
        post={post}
        creator={creator}
      />
      <PostFooter
        post={post}
        userId={userId}
        currentUser={currentUser}
        media_type={media_type}
        media_id={media_id}
        genreIds={genreIds}
      />
    </motion.div>
  );
};

export default HomePostCard;
