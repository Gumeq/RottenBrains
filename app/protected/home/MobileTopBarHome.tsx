"use client";

import NotificationButton from "@/components/notifications/RealtimeNotifications";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import MenuButtonWithSidebar from "./MenuWithSlider";

const MobileTopBarHome = () => {
  const { user } = useUser();
  const topBarRef = useRef<HTMLDivElement>(null);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const topBarHeight = 48; // Adjust this if your top bar height is different

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      const deltaY = window.scrollY - lastScrollY.current;

      if (topBarRef.current) {
        const currentTransform = topBarRef.current.style.transform;
        const match = currentTransform.match(/translateY\((-?\d+)px\)/);
        let currentTranslateY = match ? parseInt(match[1]) : 0;

        let newTranslateY = currentTranslateY - deltaY;
        newTranslateY = Math.min(0, Math.max(-topBarHeight, newTranslateY));

        topBarRef.current.style.transform = `translateY(${newTranslateY}px)`;
        topBarRef.current.style.transition = "transform 0.1s ease-out";
      }

      lastScrollY.current = window.scrollY;
      ticking.current = false;
    }
  };

  const onScroll = () => {
    if (!ticking.current) {
      window.requestAnimationFrame(controlNavbar);
      ticking.current = true;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      {/* Top bar */}
      <div
        ref={topBarRef}
        className="fixed left-0 top-0 z-50 flex h-12 w-full items-center justify-between bg-background px-4 lg:hidden"
        style={{
          transform: "translateY(0)",
          willChange: "transform",
        }}
      >
        <div className="flex flex-row gap-4">
          <MenuButtonWithSidebar />
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

        {user ? (
          <div className="flex flex-row items-center gap-4">
            <NotificationButton />
            <Link
              href={"/protected/settings"}
              // className={` ${
              //   pathname.includes("settings") ? `text-primary` : `text-foreground`
              // }`}
              className="text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className={`fill-current`}
              >
                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
              </svg>
            </Link>
            <Link href="/protected/profile" className="">
              {user?.image_url ? (
                <img
                  src={user.image_url}
                  alt="You"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-foreground/10"></div>
              )}
            </Link>
          </div>
        ) : (
          <Link
            href={"/login"}
            className="flex flex-row items-center gap-2 rounded-lg bg-foreground/10 px-2 py-1"
          >
            <img
              src="/assets/icons/account-circle-outline.svg"
              className="invert-on-dark h-5 w-5"
              alt=""
            />
            <p className="">Sign in</p>
          </Link>
        )}
      </div>
    </>
  );
};

export default MobileTopBarHome;
