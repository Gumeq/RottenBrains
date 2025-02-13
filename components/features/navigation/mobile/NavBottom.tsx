"use client";
import { useUser } from "@/hooks/UserContext";
import { usePathname } from "next/navigation";

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
} from "../../../ui/Icon";
import NavLinkMobile from "./NavBottomLink";
import NavSearchIconWithOverlay from "./NavSearchIconWithOverlay";
import NavSearchIconNew from "./NavSearchIconNew";
import AdBanner from "../../ads/GoogleDisplayAd";
import NavAdMobile from "../../ads/NavAdMobile";

const NavBottom = () => {
  const { user } = useUser();
  const pathname = usePathname();

  // Hide the bottom bar on specific routes
  if (pathname.includes("watch/tv") || pathname.includes("watch/movie")) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-background">
        {!user?.premium && (
          <div className="mx-auto h-[50px] w-screen bg-white lg:w-full">
            <NavAdMobile dataAdSlot="8769026161" />
          </div>
        )}
        <ul className="relative flex h-16 w-full flex-row items-center justify-between bg-foreground/10 p-2">
          {/* Home Link */}
          <NavLinkMobile
            href={"/"}
            icon={HomeIcon}
            label={"Home"}
          ></NavLinkMobile>
          <NavLinkMobile
            href={"/protected/explore"}
            icon={ExploreIcon}
            label={"Explore"}
          ></NavLinkMobile>
          <NavSearchIconWithOverlay />
          {/* <NavSearchIconNew></NavSearchIconNew> */}
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
      </nav>
    </>
  );
};

export default NavBottom;
