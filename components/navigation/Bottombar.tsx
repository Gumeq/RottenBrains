"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationButton from "../notifications/RealtimeNotifications";

const Bottombar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 z-50 flex w-screen items-center justify-center drop-shadow-xl lg:hidden">
      <ul className="relative flex h-14 w-full flex-row items-center justify-between border-t border-foreground/20 bg-background px-4 drop-shadow-xl">
        <li>
          <Link href={"/protected/home"} className="flex flex-col items-center">
            <img
              src="/assets/icons/home-outline.svg"
              alt="Home"
              width={25}
              height={25}
              className="invert-on-dark"
            ></img>
            <p className="text-sm">Home</p>
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
            <p className="text-sm">Explore</p>
          </Link>
        </li>
        <Link
          className="shadow_plus absolute left-1/2 top-[30%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-foreground/20 bg-background"
          href={"/protected/create-post"}
        >
          <img
            src="/assets/icons/plus.svg"
            alt="Create Post"
            className="invert-on-dark h-10 w-10"
          />
        </Link>

        <li className="h-full w-[50px]"></li>

        <li className="flex flex-col items-center rounded-full">
          <NotificationButton />
          <p className="text-sm">Notifs</p>
        </li>
        <li>
          <Link
            href={"/protected/profile"}
            className="flex min-h-[45px] min-w-[45px] flex-col items-center"
          >
            <img
              src={user?.image_url}
              alt="You"
              width={25}
              height={25}
              className="overflow-hidden rounded-full border border-foreground/30 drop-shadow-xl"
            ></img>
            <p className="text-sm">You</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Bottombar;
