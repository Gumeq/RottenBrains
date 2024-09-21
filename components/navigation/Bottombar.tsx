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
      className={`fixed bottom-0 z-50 flex h-14 w-screen items-center justify-center drop-shadow-xl lg:hidden ${pathname.includes("watch") ? "hidden" : ""}`}
    >
      <ul className="relative flex h-14 w-full flex-row items-center justify-between border-t border-foreground/20 bg-background px-8 drop-shadow-xl">
        <li>
          <Link href={"/protected/home"} className="flex flex-col items-center">
            <img
              src="/assets/icons/home-outline.svg"
              alt="Home"
              width={25}
              height={25}
              className="invert-on-dark"
            ></img>
            <p className="text-xs">Home</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/protected/explore"}
            className="flex flex-col items-center"
          >
            <img
              src="/assets/icons/explore-outline.svg"
              alt="Explore"
              width={25}
              height={25}
              className="invert-on-dark"
            ></img>
            <p className="text-xs">Explore</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/protected/create-post"}
            className="flex flex-col items-center rounded-full border border-foreground"
          >
            <img
              src="/assets/icons/plus.svg"
              alt="Explore"
              width={35}
              height={35}
              className="invert-on-dark"
            ></img>
          </Link>
        </li>
        <li>
          <Link
            href={"/protected/watch-list"}
            className="flex flex-col items-center"
          >
            <img
              src="/assets/icons/folder-outline.svg"
              alt="Explore"
              width={25}
              height={25}
              className="invert-on-dark"
            ></img>
            <p className="text-xs">Lists</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/protected/profile"}
            className="flex flex-col items-center"
          >
            <img
              src={user?.image_url}
              alt="You"
              width={25}
              height={25}
              className="overflow-hidden rounded-full"
            ></img>
            <p className="text-xs">You</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Bottombar;
