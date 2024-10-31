// app/components/ClientComponent.jsx
"use client"; // This directive marks the component as a client component

import React, { useState } from "react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/searchBar/SearchBar";
import NotificationButton from "@/components/notifications/RealtimeNotifications";
import ProfilePicture from "@/components/navigation/ProfilePicture";
import ThemeSwitch from "@/components/ThemSwitch";
import VersionDisplay from "@/components/VersionDisplay";
import NavLink from "./NavLink";
import {
  ExploreIcon,
  HistoryIcon,
  HomeIcon,
  LikedPostsIcon,
  ProfileIcon,
  SavedPostsIcon,
  WatchLaterIcon,
  WatchListIcon,
  YouIcon,
} from "./Icon";

const HomeNav = ({ children }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <nav
        className={`fixed top-0 z-30 hidden h-16 w-screen items-center justify-center bg-background/50 p-1 lg:flex`}
      >
        <div className="flex flex-col items-center">
          <div className="flex w-screen flex-row items-center justify-between gap-10 pr-8">
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="m-1 rounded-full p-2 hover:bg-foreground/20"
              >
                <img
                  src="/assets/icons/menu.svg"
                  alt="menu-icon"
                  width={30}
                  height={30}
                  className="invert-on-dark p-1"
                />
              </button>
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

            <div className="h-full w-screen p-2 lg:max-w-[40vw] lg:p-0">
              <SearchBar link={true} user={true}></SearchBar>
            </div>

            <div className="flex flex-row items-center gap-8">
              <Link
                href={"/protected/create-post"}
                className={` ${
                  pathname.includes("create-post")
                    ? `text-primary`
                    : `text-foreground`
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className={`fill-current`}
                >
                  <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              </Link>
              <NotificationButton></NotificationButton>
              <div className="flex items-center">
                <ProfilePicture></ProfilePicture>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="relative hidden flex-row lg:flex lg:h-svh lg:w-screen">
        {isSidebarOpen ? (
          <div className="mt-16 min-w-[220px] bg-background">
            <ul className="flex flex-col justify-start gap-2 p-2">
              <NavLink href="/protected/home" icon={HomeIcon} label="Home" />
              <NavLink
                href="/protected/explore"
                icon={ExploreIcon}
                label="Explore"
              />
              <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
              <NavLink href="/protected/profile" icon={YouIcon} label="You" />
              <NavLink
                href="/protected/profile"
                icon={ProfileIcon}
                label="Your profile"
              />
              <NavLink
                href="/protected/watch-history"
                icon={HistoryIcon}
                label="History"
              />
              <NavLink
                href="/protected/liked-posts"
                icon={LikedPostsIcon}
                label="Liked posts"
              />
              <NavLink
                href="/protected/saved-posts"
                icon={SavedPostsIcon}
                label="Saved posts"
              />
              <NavLink
                href="/protected/watch-list"
                icon={WatchListIcon}
                label="Watch list"
              />
              <NavLink
                href="/protected/watch-later"
                icon={WatchLaterIcon}
                label="Watch later"
              />
            </ul>
            <div className="absolute bottom-0 flex flex-col gap-2 p-2 text-sm text-foreground/50">
              <VersionDisplay></VersionDisplay>
              <p>&copy; {new Date().getFullYear()} GUMEQ INC.</p>
            </div>
          </div>
        ) : (
          <div className="mt-16 min-w-16 bg-background">
            <ul className="flex flex-col justify-center gap-2 p-1 py-4">
              <NavLink href="/protected/home" icon={HomeIcon} />
              <NavLink href="/protected/explore" icon={ExploreIcon} />
              <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
              <NavLink href="/protected/profile" icon={ProfileIcon} />
              <NavLink href="/protected/watch-history" icon={HistoryIcon} />
              <NavLink href="/protected/liked-posts" icon={LikedPostsIcon} />
              <NavLink href="/protected/saved-posts" icon={SavedPostsIcon} />
              <NavLink href="/protected/watch-list" icon={WatchListIcon} />
              <NavLink href="/protected/watch-later" icon={WatchLaterIcon} />
            </ul>
          </div>
        )}
        <div className="custom-scrollbar mt-16 w-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HomeNav;
