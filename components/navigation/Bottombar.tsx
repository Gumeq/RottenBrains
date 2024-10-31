"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationButton from "../notifications/RealtimeNotifications";

const Bottombar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div
      className={`fixed bottom-0 z-50 flex h-14 w-screen items-center justify-center drop-shadow-xl lg:hidden ${
        pathname.includes("watch/tv") || pathname.includes("watch/movie")
          ? "hidden"
          : ""
      }`}
    >
      <ul className="relative flex h-14 w-full flex-row items-center justify-between border-t border-foreground/20 bg-background drop-shadow-xl">
        <Link
          href={"/protected/home"}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <img
            src="/assets/icons/home-outline.svg"
            alt="Home"
            width={24}
            height={24}
            className="invert-on-dark bg"
          ></img>
          <p className="text-xs">Home</p>
        </Link>
        <Link
          href={"/protected/explore"}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <img
            src="/assets/icons/explore-outline.svg"
            alt="Explore"
            width={24}
            height={24}
            className="invert-on-dark"
          ></img>
          <p className="text-xs">Explore</p>
        </Link>
        <Link
          href={"/protected/create-post"}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <img
            src="/assets/icons/plus.svg"
            alt="Explore"
            width={24}
            height={24}
            className="invert-on-dark"
          ></img>
          <p className="text-xs">Create</p>
        </Link>
        <Link
          href={"/protected/watch-list"}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <img
            src="/assets/icons/folder-outline.svg"
            alt="Explore"
            width={24}
            height={24}
            className="invert-on-dark"
          ></img>
          <p className="text-xs">Lists</p>
        </Link>
        <Link
          href={"/protected/profile"}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <img
            src={user?.image_url}
            alt="You"
            width={24}
            height={24}
            className="overflow-hidden rounded-full"
          ></img>
          <p className="text-xs">You</p>
        </Link>
      </ul>
    </div>
  );
};

export default Bottombar;
