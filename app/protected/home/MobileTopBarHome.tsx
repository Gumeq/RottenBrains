"use client";

import NotificationButton from "@/components/notifications/RealtimeNotifications";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import SearchIconWithOverlay from "./SearchIconWithOverlay";
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

        <div className="flex flex-row gap-6">
          <NotificationButton />
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
              <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileTopBarHome;
