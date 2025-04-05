"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ImageWithFallback from "../media/ImageWithFallback";
import NavAdMobile from "../ads/NavAdMobile";
import { useUser } from "@/hooks/UserContext";
import { iframeLinks } from "@/lib/constants/links";

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
  const [provider, setProvider] = useState<string>(iframeLinks[0].name);
  const [showVideo, setShowVideo] = useState(false);
  const { user } = useUser();

  // Function to check if a provider name is valid
  const isValidProvider = (providerName: string | null) => {
    return (
      providerName && iframeLinks.some((link) => link.name === providerName)
    );
  };

  // Read provider from local storage on mount
  useEffect(() => {
    const storedProvider = localStorage.getItem("video_provider");
    if (isValidProvider(storedProvider)) {
      setProvider(storedProvider as string);
    }

    // Listen for storage changes (e.g., from another tab)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "video_provider") {
        // If the provider is valid, update state; else revert to default
        if (isValidProvider(event.newValue)) {
          setProvider(event.newValue as string);
        } else {
          setProvider(iframeLinks[0].name);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Get the selected provider info
  const selectedProvider =
    iframeLinks.find((link) => link.name === provider) || iframeLinks[0];

  // Build the iframe URL
  const iframeSrc = selectedProvider.template({
    media_type,
    media_id,
    season_number: season_number?.toString(),
    episode_number: episode_number?.toString(),
  });

  console.log(iframeSrc);

  // Return a placeholder if there's no media
  if (!media) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 text-center lg:rounded-[8px]" />
    );
  }

  // Determine the correct image URL for the thumbnail
  const imageUrl =
    media_type === "movie" ? media.backdrop_path : episode?.still_path;
  const titleOrName = media?.title || episode?.name || "Thumbnail";

  return (
    <section className="fixed left-0 top-0 z-30 w-screen flex-col bg-background lg:relative lg:z-0 lg:w-full lg:pb-0">
      {/* Mobile top bar */}
      <div className="flex h-10 w-full items-center gap-4 bg-background px-2 lg:hidden">
        <Link href="/" className="px-2">
          <img
            src="/assets/images/logo_text_new.svg"
            alt="RottenBrains Logo"
            className="invert-on-dark h-3 w-auto"
          />
        </Link>
      </div>
      <div className="w-screen lg:w-full">
        {!user?.premium ? (
          <div className="z-30 aspect-[16/9] w-full flex-col overflow-hidden bg-background lg:rounded-[8px] lg:pb-0">
            <div className="h-full w-full bg-foreground/10"></div>
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full overflow-hidden lg:w-full lg:rounded-[8px]">
            <iframe
              allowFullScreen
              loading="lazy"
              src={iframeSrc}
              className="inline-block h-full w-full"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEmbed;
