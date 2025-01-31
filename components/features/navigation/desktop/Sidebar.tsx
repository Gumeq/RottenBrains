"use client";

import React from "react";
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
  PremiumIcon,
  DonationsIcon,
  HelpIcon,
  FeedbackIcon,
  GithubIcon,
  CookiesIcon,
  LegalIcon,
  InfoIcon,
} from "../../../ui/Icon";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSidebar } from "@/hooks/SidebarContext";
import NavLink from "./NavLink";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar(); // Destructure from context

  return (
    <aside
      className={`fixed left-0 top-16 h-full bg-background transition-all duration-300 ${
        isSidebarOpen ? "w-60" : "w-20"
      }`}
    >
      {isSidebarOpen ? (
        <ul className="flex flex-col justify-start p-2">
          <NavLink
            href="/"
            icon={HomeIcon}
            icon_fill={HomeIconFill}
            label="Home"
          />
          <NavLink
            href="/protected/explore"
            icon={ExploreIcon}
            label="Explore"
          />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink
            href="/protected/profile"
            icon={ProfileIcon}
            label="Your profile"
          />
          <NavLink
            href="/protected/watch-list"
            icon={WatchListIcon}
            label="Library"
          />
          <NavLink
            href="/protected/watch-history"
            icon={HistoryIcon}
            label="History"
          />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/premium" icon={PremiumIcon} label="Premium" />
          <NavLink href="/donations" icon={DonationsIcon} label="Donations" />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/blog" icon={DevBlogIcon} label="Developer Blog" />
          <NavLink href="/github" icon={GithubIcon} label="Github" />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/info" icon={InfoIcon} label="Info" />
          <NavLink href="/legal" icon={LegalIcon} label="Legal" />
          <NavLink href="/help" icon={HelpIcon} label="Help" />
          <NavLink href="/cookie-policy" icon={CookiesIcon} label="Cookies" />
          <NavLink href="/feedback" icon={FeedbackIcon} label="Feedback" />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
        </ul>
      ) : (
        <ul className="flex flex-col justify-start p-2">
          <NavLink href="/" icon={HomeIcon} />
          <NavLink href="/protected/explore" icon={ExploreIcon} />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/protected/profile" icon={ProfileIcon} />
          <NavLink href="/protected/watch-list" icon={WatchListIcon} />
          <NavLink href="/protected/watch-history" icon={HistoryIcon} />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/premium" icon={PremiumIcon} />
          <NavLink href="/donations" icon={DonationsIcon} />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/blog" icon={DevBlogIcon} />
          <NavLink href="/github" icon={GithubIcon} />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <NavLink href="/info" icon={InfoIcon} />
          <NavLink href="/legal" icon={LegalIcon} />
          <NavLink href="/help" icon={HelpIcon} />
          <NavLink href="/cookie-policy" icon={CookiesIcon} />
          <NavLink href="/feedback" icon={FeedbackIcon} />
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
