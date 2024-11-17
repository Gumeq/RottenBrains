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
  const [iframeVisible, setIframeVisible] = useState(false); // Control iframe visibility
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    mobileVideoPlaying,
    setMobileVideoPlaying,
    mobileVideoLoading,
    setMobileVideoLoading,
  } = useContext(MobileVideoContext);

  // Detect if the device is mobile
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);
  }, []);

  // Fetch the video
  const fetchVideo = async () => {
    try {
      const data = await getVideos(media_type, media_id);

      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const trailer =
          data.results.find(
            (video: any) =>
              video.type === "Trailer" && video.site === "YouTube",
          ) || data.results.find((video: any) => video.site === "YouTube");

        if (trailer && trailer.key && trailer.site === "YouTube") {
          const videoUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&cc_load_policy=1&cc_lang_pref=en`;
          setVideoUrl(videoUrl);
        } else {
          setVideoUrl(null); // No video found
          setIsLoading(false); // Stop loading if no video is available
          setMobileVideoLoading(false);
        }
      } else {
        setVideoUrl(null); // No video found
        setIsLoading(false); // Stop loading if no video is available
        setMobileVideoLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch video:", error);
      setVideoUrl(null);
      setIsLoading(false); // Stop loading on error
      setMobileVideoLoading(false);
    }
  };

  // Desktop Hover Effect
  useEffect(() => {
    if (isMobileDevice) return;

    let hoverTimeout: NodeJS.Timeout | null = null;

    if (isHovered) {
      setIsLoading(true); // Show loading bar immediately on hover
      setTimeout(() => {
        setMobileVideoLoading(true), 1500;
      });
      hoverTimeout = setTimeout(() => {
        setShowOverlay(true);
        fetchVideo();
      }, 1000); // Delay showing the overlay only
    } else {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      setShowOverlay(false);
      setIsLoading(false); // Reset loading state when hover ends
      setMobileVideoLoading(false);
      setIframeVisible(false); // Reset iframe visibility
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
        const rect = entry.boundingClientRect;
        const isInTopHalf =
          rect.top >= 0 && rect.bottom <= window.innerHeight * 0.5; // Fully visible in top 50%

        if (isInTopHalf) {
          if (!mobileVideoPlaying) {
            setIsLoading(true); // Show loading bar immediately when visible
            visibilityTimeout = setTimeout(() => {
              setMobileVideoLoading(true);
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
            setMobileVideoLoading(false);
            setIframeVisible(false); // Reset iframe visibility
            setVideoUrl(null);
          }
        }
      });
    };

    observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: 0.0, // Trigger callback as soon as any part of the element is visible
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

  // Handle iframe load and add 0.2-second delay with fade-in effect
  const handleIframeLoad = () => {
    setTimeout(() => {
      setIframeVisible(true); // Start fade-in after 0.2 seconds
      setTimeout(() => {
        setIsLoading(false); // Stop loading after iframe is fully visible
        setMobileVideoLoading(false);
      }, 500); // Additional delay for fade-in transition
    }, 200);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[8px]"
      onMouseEnter={!isMobileDevice ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobileDevice ? () => setIsHovered(false) : undefined}
      ref={ref}
    >
      {imageUrl ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
          alt={altText}
          loading="lazy"
          className="aspect-[16/9] w-full overflow-hidden bg-foreground/10"
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
      {isLoading && !isMobileDevice && (
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
                onLoad={handleIframeLoad} // Set iframe as loaded when it finishes loading
                className={`transition-opacity delay-200 duration-500 ${
                  iframeVisible ? "opacity-100" : "opacity-0"
                }`} // Apply fade-in effect
              ></iframe>
              <div className="absolute inset-0"></div>
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
