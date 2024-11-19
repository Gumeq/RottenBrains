"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Bottombar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  // Hide the bottom bar on specific routes
  if (pathname.includes("watch/tv") || pathname.includes("watch/movie")) {
    return null;
  }

  return (
    <div className="bottombar">
      <ul className="bottombar-inner">
        {/* Home Link */}
        <Link href="/protected/home" className="bottombar-link">
          <Image
            src="/assets/icons/home-outline.svg"
            alt="Home"
            width={24}
            height={24}
            className="invert-on-dark"
          />
          <p className="text-xs">Home</p>
        </Link>

        {/* Explore Link */}
        <Link href="/protected/explore" className="bottombar-link">
          <Image
            src="/assets/icons/explore-outline.svg"
            alt="Explore"
            width={24}
            height={24}
            className="invert-on-dark"
          />
          <p className="text-xs">Explore</p>
        </Link>

        {/* Create Post Link */}
        <Link href="/protected/create-post" className="bottombar-link">
          <Image
            src="/assets/icons/plus.svg"
            alt="Create"
            width={24}
            height={24}
            className="invert-on-dark"
          />
          <p className="text-xs">Create</p>
        </Link>

        {/* Watch List Link */}
        <Link href="/protected/watch-list" className="bottombar-link">
          <Image
            src="/assets/icons/folder-outline.svg"
            alt="Lists"
            width={24}
            height={24}
            className="invert-on-dark"
          />
          <p className="text-xs">Lists</p>
        </Link>

        {/* Profile Link */}
        <Link href="/protected/profile" className="bottombar-link">
          {user?.image_url ? (
            <Image
              src={user.image_url}
              alt="You"
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
          )}
          <p className="text-xs">You</p>
        </Link>
      </ul>
    </div>
  );
};

export default Bottombar;
