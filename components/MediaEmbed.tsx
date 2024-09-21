"use client";

import { formatEpisodeCode } from "@/lib/functions";
// components/VideoEmbed.js
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ShareButton from "./ShareButton";

type VideoEmbedProps = {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
};

const VideoEmbed = ({
  media_type,
  media_id,
  season_number,
  episode_number,
}: VideoEmbedProps) => {
  const [linkStart, setLinkStart] = useState<string>(
    "https://vidsrc.net/embed/",
  );
  const [media, setMedia] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [showVideo, setShowVideo] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [prevClicked, setPrevClicked] = useState(false);

  const updateLinkStart = (newLinkStart: string) => {
    setLinkStart(newLinkStart);
    setShowVideo(false); // Reset the video display when changing the link
  };

  let link = "";
  if (media_type === "movie") {
    link = `${linkStart}${media_type}/${media_id}`;
  } else {
    link = `${linkStart}${media_type}/${media_id}/${season_number}/${episode_number}`;
  }

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const mediaData = await getMediaDetails(media_type, media_id);
        if (mediaData && mediaData.seasons) {
          mediaData.seasons = mediaData.seasons.filter(
            (season: { season_number: number }) => season.season_number !== 0,
          );
        }
        setMedia(mediaData);
      } catch (error) {
        console.error("Error fetching media data:", error);
        setMedia(null);
      }
    };

    fetchMediaDetails();
  }, [media_type, media_id]);

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      if (season_number && episode_number) {
        try {
          const episodeData = await getEpisodeDetails(
            media_id,
            season_number,
            episode_number,
          );
          setEpisode(episodeData);
        } catch (error) {
          console.error("Error fetching episode data:", error);
          setEpisode(null);
        }
      }
    };

    if (media_type === "tv") {
      fetchEpisodeDetails();
    }
  }, [media_type, media_id, season_number, episode_number]);

  const handleButtonClick = () => {
    setShowVideo(true);
  };

  if (!media) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 text-center drop-shadow-lg lg:rounded-[16px]"></div>
    );
  }

  const handleNextClick = () => {
    setNextClicked(true);
    setPrevClicked(false);
  };

  const handlePrevClick = () => {
    setPrevClicked(true);
    setNextClicked(false);
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex w-screen flex-col border-b border-foreground/20 bg-background pb-2 drop-shadow-lg lg:relative lg:w-auto lg:gap-2 lg:border-none lg:pb-0 lg:drop-shadow-none">
      <div className="z-20 flex h-12 w-full flex-row items-center gap-4 bg-background px-2 lg:hidden">
        <div className="flex h-full items-center">
          <Link
            href={"/protected/home"}
            className="flex flex-row items-center gap-2"
          >
            <img
              src="/assets/images/logo_new.png"
              alt="text-logo"
              className="h-10 w-auto"
            />
            <h1 className="text-lg font-black text-foreground">RottenBrains</h1>
          </Link>
        </div>
      </div>
      <div>
        {!showVideo ? (
          <div className="relative w-full overflow-hidden text-center lg:rounded-[16px]">
            <img
              src={
                media_type === "movie"
                  ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
                  : episode &&
                    `https://image.tmdb.org/t/p/original${episode.still_path}`
              }
              alt="Media Poster"
              className="h-auto w-full bg-foreground/10 drop-shadow-lg lg:w-full"
            />
            <button
              onClick={handleButtonClick}
              className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/60 text-lg font-semibold text-white transition-colors duration-300 hover:bg-accent/80"
            >
              <img
                src="/assets/icons/play-solid.svg"
                alt=""
                width={20}
                height={20}
                className="min-h-[40px] min-w-[40px] invert"
              />
            </button>
          </div>
        ) : (
          <div className="relative z-50 aspect-[16/9] overflow-hidden drop-shadow-lg lg:rounded-[16px]">
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
      <div className="flex flex-row justify-between px-4 py-2 lg:p-0 lg:py-2">
        <span className="flex flex-row flex-wrap items-center gap-2 text-lg font-semibold lg:font-bold">
          {season_number !== undefined &&
            episode_number !== undefined &&
            episode && (
              <h2 className="">
                {episode.name}
                {" | "}
                {formatEpisodeCode(season_number, episode_number)}
                {" | "}
              </h2>
            )}
          <p className="truncate pr-1">{media.title || media.name}</p>
        </span>
      </div>
      <div className="hidden-scrollbar flex flex-row items-center justify-between gap-6 overflow-x-auto px-2 text-sm lg:overflow-auto lg:px-0">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => updateLinkStart("https://vidsrc.cc/v2/embed/")}
            className="z-10 flex flex-row items-center gap-2 rounded-full bg-foreground/10 px-4 py-2"
          >
            vidsrc.cc
          </button>
          <button
            onClick={() => updateLinkStart("https://vidsrc.net/embed/")}
            className="z-10 flex flex-row items-center gap-2 rounded-full bg-foreground/10 px-4 py-2"
          >
            vidsrc.net
          </button>
          <button
            onClick={() => updateLinkStart("https://vidsrc.pro/embed/")}
            className="z-10 flex flex-row items-center gap-2 rounded-full bg-foreground/10 px-4 py-2"
          >
            vidsrc.pro
          </button>
        </div>
        <div className="flex flex-shrink-0 flex-row gap-2">
          <Link
            href={`/protected/create-post/${media_type}/${media_id}`}
            className="z-10 flex flex-row items-center gap-2 justify-self-end rounded-full bg-foreground/10 p-2 px-4"
          >
            <img
              src="/assets/icons/star-outline.svg"
              alt=""
              width={20}
              height={20}
              className="invert-on-dark"
              loading="lazy"
            />
            <p className="">Rate</p>
          </Link>
          <ShareButton></ShareButton>
        </div>
      </div>
    </div>
  );
};

export default VideoEmbed;
