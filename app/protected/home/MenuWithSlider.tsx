"use client";

import React, { useState } from "react";
import VersionDisplay from "@/components/VersionDisplay";
import NavLinkMobile from "./NavLinkMobile";
import {
  DevBlogIcon,
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
} from "./Icon";

const MenuButtonWithSidebar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Menu Button */}
      <button onClick={toggleMenu} aria-label="Open Menu">
        <img
          src="/assets/icons/menu.svg"
          alt="menu icon"
          className="invert-on-dark h-6 w-6"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-2/3 transform bg-background text-white drop-shadow-md transition-transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full bg-background">
          <button
            onClick={toggleMenu}
            aria-label="Close Menu"
            className="p-4 text-lg text-white"
          >
            X
          </button>
          <ul className="flex flex-col justify-start px-4 py-2">
            <NavLinkMobile
              href="/protected/home"
              icon={HomeIcon}
              icon_fill={HomeIconFill}
              label="Home"
            />
            <NavLinkMobile
              href="/protected/explore"
              icon={ExploreIcon}
              label="Explore"
            />
            <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
            {/* <NavLinkMobile
              href="/protected/profile"
              icon={YouIcon}
              label="You"
            /> */}
            <NavLinkMobile
              href="/protected/profile"
              icon={ProfileIcon}
              label="Your profile"
            />
            <NavLinkMobile
              href="/protected/watch-history"
              icon={HistoryIcon}
              label="History"
            />
            {/* <NavLinkMobile
              href="/protected/liked-posts"
              icon={LikedPostsIcon}
              label="Liked posts"
            />
            <NavLinkMobile
              href="/protected/saved-posts"
              icon={SavedPostsIcon}
              label="Saved posts"
            /> */}
            <NavLinkMobile
              href="/protected/watch-list"
              icon={WatchListIcon}
              label="Library"
            />
            {/* <NavLinkMobile
              href="/protected/watch-later"
              icon={WatchLaterIcon}
              label="Watch later"
            /> */}
            <NavLinkMobile
              href="/blog"
              icon={DevBlogIcon}
              label="Developer blog"
            />
          </ul>
          <div className="absolute bottom-0 flex flex-col gap-2 p-2 text-sm text-foreground/50">
            <VersionDisplay></VersionDisplay>
            <p>&copy; {new Date().getFullYear()} GUMEQ INC.</p>
          </div>
        </div>
      </div>

      {/* Backdrop (optional, to close the menu when clicking outside) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default MenuButtonWithSidebar;
