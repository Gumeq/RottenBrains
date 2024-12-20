"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SearchIconWithOverlay from "@/app/protected/home/SearchIconWithOverlay";

const Bottombar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  // Hide the bottom bar on specific routes
  if (pathname.includes("watch/tv") || pathname.includes("watch/movie")) {
    return null;
  }

  return (
    <div className="bottombar Z-50">
      <ul className="bottombar-inner Z-50">
        {/* Home Link */}
        <Link href="/protected/home" className="bottombar-link">
          <img
            src="/assets/icons/home-outline.svg"
            alt="Home"
            width={40}
            height={40}
            className="invert-on-dark rounded-full p-2"
          />
          <p className="text-xs">Home</p>
        </Link>

        {/* Explore Link */}
        <Link href="/protected/explore" className="bottombar-link">
          <img
            src="/assets/icons/explore-outline.svg"
            alt="Explore"
            width={40}
            height={40}
            className="invert-on-dark rounded-full p-2"
          />
          <p className="text-xs">Explore</p>
        </Link>

        <SearchIconWithOverlay />

        {/* Create Post Link */}
        <Link href="/protected/create-post" className="bottombar-link">
          <img
            src="/assets/icons/plus.svg"
            alt="Create"
            width={40}
            height={40}
            className="invert-on-dark rounded-full p-2"
          />
          <p className="text-xs">Create</p>
        </Link>

        {/* Watch List Link */}
        <Link href="/protected/watch-list" className="bottombar-link">
          <img
            src="/assets/icons/library-svg.svg"
            alt="Lists"
            width={40}
            height={40}
            className="invert-on-dark rounded-full p-2"
          />
          <p className="text-xs">Library</p>
        </Link>
      </ul>
    </div>
  );
};

export default Bottombar;
