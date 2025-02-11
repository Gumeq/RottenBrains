"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ShareButton from "./ShareButton";
import ImageWithFallback from "../media/ImageWithFallback";

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
  const [linkStart, setLinkStart] = useState<string>("/api/testapi");
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

  const buildLink = () => {
    // If the link starts with "https://www.2embed.cc/embed"
    if (linkStart.startsWith("https://www.2embed.cc/embed")) {
      return `${linkStart}${media_type}/${media_id}&s=${season_number}&e=${episode_number}`;
    }

    // Else if the link starts with "/api/testapi"
    if (linkStart.startsWith("/api/testapi")) {
      const seasonEpisodeString = `&season=${season_number}&episode=${episode_number}`;
      return `${linkStart}?video_id=${media_id}&tmdb=1${
        media_type === "tv" ? seasonEpisodeString : ""
      }`;
    }

    // Otherwise
    if (media_type === "movie") {
      return `${linkStart}${media_type}/${media_id}`;
    } else {
      return `${linkStart}${media_type}/${season_number}/${episode_number}`;
    }
  };

  const link = buildLink();

  if (!media) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 text-center lg:rounded-[8px]"></div>
    );
  }

  const imageUrl =
    media_type === "movie" ? media.backdrop_path : episode.still_path;

  return (
    <section className="fixed left-0 top-0 z-50 flex w-screen flex-col border-foreground/20 bg-background lg:relative lg:z-0 lg:w-full lg:gap-2 lg:border-none lg:pb-0">
      <div className="flex h-10 w-full flex-row items-center gap-4 bg-background px-2 lg:hidden">
        <div className="flex h-full items-center px-2">
          <Link href={"/"} className="flex flex-row items-center gap-2">
            <img
              src="/assets/images/logo_text_new.svg"
              alt="RottenBrains Logo"
              className="invert-on-dark h-3 w-auto"
            />
          </Link>
        </div>
      </div>
      <div className="w-full">
        {!showVideo ? (
          <button
            className="relative aspect-[16/9] w-full overflow-hidden text-center lg:rounded-[8px]"
            onClick={handleButtonClick}
          >
            <ImageWithFallback
              imageUrl={imageUrl}
              altText={media.title || episode.name}
              quality={"original"}
            />
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/60 text-lg font-semibold text-white transition-colors duration-300 hover:bg-accent/80">
              <img
                src="/assets/icons/play-solid.svg"
                alt="Play"
                width={20}
                height={20}
                className="min-h-[24px] min-w-[24px] invert"
              />
            </div>
          </button>
        ) : (
          <div className="relative aspect-[16/9] w-screen overflow-hidden lg:w-full lg:rounded-[8px]">
            <iframe
              allowFullScreen
              id="iframe"
              loading="lazy"
              src={link}
              className="inline-block h-full w-full"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              scrolling="no"
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEmbed;
