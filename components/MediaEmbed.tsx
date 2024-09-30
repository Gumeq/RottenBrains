"use client";

import { formatEpisodeCode } from "@/lib/functions";
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

  // Retrieve the selected provider from local storage when the component mounts
  useEffect(() => {
    const storedProvider = localStorage.getItem("video_provider");
    if (storedProvider) {
      setLinkStart(storedProvider);
    }
  }, []);

  const updateLinkStart = (newLinkStart: string) => {
    setLinkStart(newLinkStart);
    setShowVideo(false); // Reset the video display when changing the link

    // Save the new provider to local storage
    localStorage.setItem("video_provider", newLinkStart);
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
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 text-center drop-shadow-lg lg:rounded-[8px]"></div>
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
        <div className="flex h-full items-center px-2">
          <Link
            href={"/protected/home"}
            className="flex flex-row items-center gap-2"
          >
            <img
              src="/assets/images/logo_text_new.svg"
              alt="text-logo"
              className="invert-on-dark h-4 w-auto"
            />
          </Link>
        </div>
      </div>
      <div>
        {!showVideo ? (
          <div className="relative w-full overflow-hidden text-center lg:rounded-[8px]">
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
            <div className="absolute left-4 top-4 text-xl font-bold">
              {linkStart}
            </div>
            <button
              onClick={handleButtonClick}
              className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/60 text-lg font-semibold text-white transition-colors duration-300 hover:bg-accent/80"
            >
              <img
                src="/assets/icons/play-solid.svg"
                alt="Play"
                width={20}
                height={20}
                className="min-h-[40px] min-w-[40px] invert"
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
      <div className="flex flex-row items-center justify-between overflow-x-auto px-4 py-2 lg:p-0 lg:py-2">
        <h2 className="mr-1 line-clamp-1 text-lg font-semibold">
          {episode !== undefined && season_number && episode_number
            ? `${episode.name} | ${formatEpisodeCode(season_number, episode_number)} | ${media.name}`
            : `${media.title || media.name}`}
        </h2>
        <div className="flex flex-shrink-0 flex-row gap-2">
          <Link
            href={`/protected/create-post/${media_type}/${media_id}`}
            className="z-10 flex flex-row items-center gap-2 justify-self-end rounded-full bg-foreground/10 p-2 px-4"
          >
            <img
              src="/assets/icons/star-outline.svg"
              alt="Rate"
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