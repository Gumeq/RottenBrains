"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ShareButton from "./ShareButton";
import { formatEpisodeCode } from "@/lib/functions";

type VideoEmbedProps = {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  media: any;
  episode?: any;
};

const VideoEmbed = ({
  media_type,
  media_id,
  season_number,
  episode_number,
  media,
  episode,
}: VideoEmbedProps) => {
  const [linkStart, setLinkStart] = useState<string>(
    "https://vidsrc.net/embed/",
  );
  const [showVideo, setShowVideo] = useState(false);

  // Retrieve the selected provider from local storage when the component mounts
  useEffect(() => {
    const storedProvider = localStorage.getItem("video_provider");
    if (storedProvider) {
      setLinkStart(storedProvider);
    }
  }, []);

  const handleButtonClick = () => {
    setShowVideo(true);
  };

  const link =
    media_type === "movie"
      ? `${linkStart}${media_type}/${media_id}`
      : `${linkStart}${media_type}/${media_id}/${season_number}/${episode_number}`;

  if (!media) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 text-center drop-shadow-lg lg:rounded-[8px]"></div>
    );
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex w-screen flex-col border-b border-foreground/20 bg-background drop-shadow-lg lg:relative lg:w-auto lg:gap-2 lg:border-none lg:pb-0 lg:drop-shadow-none">
      <div className="z-20 flex h-12 w-full flex-row items-center gap-4 bg-background px-2 lg:hidden">
        <div className="flex h-full items-center px-2">
          <Link
            href={"/protected/home"}
            className="flex flex-row items-center gap-2"
          >
            <img
              src="/assets/images/logo_text_new.svg"
              alt="RottenBrains Logo"
              className="invert-on-dark h-4 w-auto"
            />
          </Link>
        </div>
      </div>
      <div>
        {!showVideo ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden text-center lg:rounded-[8px]">
            <img
              src={
                media_type === "movie"
                  ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
                  : episode &&
                    `https://image.tmdb.org/t/p/original${episode.still_path}`
              }
              alt={`${media.title || media.name} Backdrop`}
              className="h-auto w-full bg-foreground/10 drop-shadow-lg lg:w-full"
            />
            <div className="absolute left-4 top-4 text-xl font-bold">
              {linkStart}
            </div>
            <button
              onClick={handleButtonClick}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/60 text-lg font-semibold text-white transition-colors duration-300 hover:bg-accent/80"
            >
              <img
                src="/assets/icons/play-solid.svg"
                alt="Play"
                width={20}
                height={20}
                className="min-h-[24px] min-w-[24px] invert"
              />
            </button>
          </div>
        ) : (
          <div className="relative z-50 aspect-[16/9] overflow-hidden lg:rounded-[8px]">
            <iframe
              allowFullScreen
              id="iframe"
              loading="lazy"
              src={link}
              className="inline-block h-full w-screen lg:w-full"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              scrolling="no"
            ></iframe>
          </div>
        )}
      </div>
      <div className="hidden-scrollbar flex flex-row items-center justify-between gap-4 overflow-x-auto px-2 py-2 lg:p-0 lg:py-2">
        <h2 className="mr-1 whitespace-nowrap text-lg font-semibold">
          {episode && season_number && episode_number
            ? `${episode.name} | ${formatEpisodeCode(
                season_number,
                episode_number,
              )} | ${media.name}`
            : `${media.title || media.name}`}
        </h2>
        <div className="flex flex-shrink-0 flex-row gap-2 overflow-x-auto">
          <Link
            href={`/protected/create-post/${media_type}/${media_id}`}
            className="z-10 flex flex-row items-center gap-2 justify-self-end rounded-full bg-foreground/10 p-1 px-2"
          >
            <img
              src="/assets/icons/star-outline.svg"
              alt="Rate"
              width={16}
              height={16}
              className="invert-on-dark"
              loading="lazy"
            />
            <p>Rate</p>
          </Link>
          <ShareButton />
        </div>
      </div>
    </div>
  );
};

export default VideoEmbed;
