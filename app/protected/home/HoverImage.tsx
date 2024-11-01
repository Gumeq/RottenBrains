"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { getVideos } from "@/utils/tmdb";
import { MobileVideoContext } from "@/context/MobileVideoContext";

interface HoverImageProps {
  imageUrl: string | null;
  altText: string;
  media_type: string; // "movie" or "tv"
  media_id: number;
  children?: React.ReactNode;
}

const HoverImage: React.FC<HoverImageProps> = ({
  imageUrl,
  altText,
  media_type,
  media_id,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { mobileVideoPlaying, setMobileVideoPlaying } =
    useContext(MobileVideoContext);

  // Detect if the device is mobile
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);
  }, []);

  // Fetch the video
  const fetchVideo = async () => {
    let isCancelled = false;

    try {
      setIsLoading(true); // Start loading
      const data = await getVideos(media_type, media_id);

      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const trailer =
          data.results.find(
            (video: any) =>
              video.type === "Trailer" && video.site === "YouTube",
          ) || data.results.find((video: any) => video.site === "YouTube");

        if (trailer && trailer.key && trailer.site === "YouTube") {
          const videoUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&cc_load_policy=1&cc_lang_pref=en`;
          if (!isCancelled) {
            setVideoUrl(videoUrl);
          }
        } else {
          if (!isCancelled) {
            setVideoUrl(null); // No video found
          }
        }
      } else {
        if (!isCancelled) {
          setVideoUrl(null); // No video found
        }
      }
    } catch (error) {
      console.error("Failed to fetch video:", error);
      if (!isCancelled) {
        setVideoUrl(null);
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false); // Stop loading
      }
    }

    return () => {
      isCancelled = true;
    };
  };

  // Desktop Hover Effect
  useEffect(() => {
    if (isMobileDevice) return;

    let hoverTimeout: NodeJS.Timeout | null = null;

    if (isHovered) {
      hoverTimeout = setTimeout(() => {
        setShowOverlay(true);
        fetchVideo();
      }, 1000); // Delay of 1 second
    } else {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      setShowOverlay(false);
      setIsLoading(false); // Reset loading state when hover ends
      setVideoUrl(null); // Reset video URL when hover ends
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isHovered, isMobileDevice]);

  // Mobile Visibility Effect
  useEffect(() => {
    if (!isMobileDevice) return;

    let observer: IntersectionObserver | null = null;
    let visibilityTimeout: NodeJS.Timeout | null = null;

    const handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio === 1) {
          if (!mobileVideoPlaying) {
            visibilityTimeout = setTimeout(() => {
              setShowOverlay(true);
              fetchVideo();
              setMobileVideoPlaying(true);
            }, 1000);
          }
        } else {
          if (visibilityTimeout) {
            clearTimeout(visibilityTimeout);
            visibilityTimeout = null;
          }
          if (showOverlay) {
            setShowOverlay(false);
            setMobileVideoPlaying(false);
            setIsLoading(false);
            setVideoUrl(null);
          }
        }
      });
    };

    observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: 1.0,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observer && ref.current) {
        observer.unobserve(ref.current);
      }
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
    };
  }, [isMobileDevice, mobileVideoPlaying]);

  return (
    <div
      className="relative"
      onMouseEnter={!isMobileDevice ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobileDevice ? () => setIsHovered(false) : undefined}
      ref={ref}
    >
      {imageUrl ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
          alt={altText}
          loading="lazy"
          className="aspect-[16/9] w-full rounded-[8px] bg-foreground/10"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-foreground/10">
          <img
            src="/assets/images/logo_new_black.svg"
            alt=""
            className="invert-on-dark h-10 w-10 opacity-50"
          />
          <p className="text-sm text-foreground/50">No image available</p>
        </div>
      )}
      {children}

      {/* Loading Bar */}
      {isLoading && (
        <div className="animate-loading absolute left-0 top-0 z-50 h-1 w-full bg-accent"></div>
      )}

      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {videoUrl ? (
            <>
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Media Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
          ) : (
            <div className="text-white"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverImage;
