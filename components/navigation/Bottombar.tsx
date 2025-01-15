"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SearchIconWithOverlay from "@/app/protected/home/SearchIconWithOverlay";

import {
  ExploreIcon,
  HistoryIcon,
  HomeIcon,
  HomeIconFill,
  LikedPostsIcon,
  ProfileIcon,
  SavedPostsIcon,
  WatchLaterIcon,
  WatchListIcon,
  YouIcon,
  DevBlogIcon,
  PlusIcon,
} from "../../app/protected/home/Icon";
import NavLinkMobile from "./NavLinkMobile";

const Bottombar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  // Hide the bottom bar on specific routes
  if (pathname.includes("watch/tv") || pathname.includes("watch/movie")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background">
      <ul className="relative z-50 flex h-full w-full flex-row items-center justify-between bg-foreground/5 p-2">
        {/* Home Link */}
        <NavLinkMobile
          href={"/protected/home"}
          icon={HomeIcon}
          label={"Home"}
        ></NavLinkMobile>
        <NavLinkMobile
          href={"/protected/explore"}
          icon={ExploreIcon}
          label={"Explore"}
        ></NavLinkMobile>
        <SearchIconWithOverlay />
        <NavLinkMobile
          href={"/protected/create-post"}
          icon={PlusIcon}
          label={"Create"}
        ></NavLinkMobile>
        <NavLinkMobile
          href={"/protected/watch-list"}
          icon={WatchListIcon}
          label={"Library"}
        ></NavLinkMobile>
      </ul>
    </div>
  );
};

export default Bottombar;
