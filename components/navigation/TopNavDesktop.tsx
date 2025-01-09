"use client";
import React, { useState } from "react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import SearchBar from "../searchBar/SearchBar";
import NotificationButton from "../notifications/RealtimeNotifications";
import ProfilePicture from "./ProfilePicture";

export function TopNavbarDesktop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-30 hidden h-16 w-screen items-center justify-center bg-background p-1 ${
          pathname.includes("home") ? "lg:hidden" : "lg:flex"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="flex w-screen flex-row items-center justify-between gap-10 pr-8">
            <div className="flex flex-row gap-16">
              <div className="flex flex-row">
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
                  className="m-1 rounded-[8px] p-2"
                >
                  <img
                    src="/assets/images/logo-text-new.svg"
                    alt="text-logo"
                    width={70}
                    height={70}
                    className="invert-on-dark p-1"
                  />
                </Link>
              </div>
            </div>

            <div className="h-full w-screen p-2 lg:w-[20vw] lg:p-0">
              <SearchBar link={true} user={true}></SearchBar>
            </div>

            <div className="flex flex-row gap-8">
              <NotificationButton></NotificationButton>
              <div className="flex items-center">
                <ProfilePicture></ProfilePicture>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`sidebar fixed left-0 top-0 z-50 h-full w-[250px] bg-background shadow-lg ${
          isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        <div className="flex flex-row">
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
          <Link href={"/protected/home"} className="m-1 rounded-[8px] p-2">
            <img
              src="/assets/images/logo-text-new.svg"
              alt="text-logo"
              width={70}
              height={70}
              className="p-1 invert"
            />
          </Link>
        </div>
        <ul className="flex flex-col justify-start gap-2 p-4">
          <Link
            href={"/protected/home"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("home")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className={`fill-current`}
              >
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
              <p className="text-lg">Home</p>
            </div>
          </Link>
          <Link
            href={"/protected/explore"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("explore")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="m260-260 300-140 140-300-300 140-140 300Zm220-180q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
              <p className="text-lg">Explore</p>
            </div>
          </Link>
          <div className="mx-auto my-2 h-[1px] w-[90%] bg-foreground/20"></div>
          <Link
            href={"/protected/profile"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("you-profile")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <p className="text-lg">You</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </div>
          </Link>
          <Link
            href={"/protected/profile"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("profile")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
              <p className="text-lg">Your profile</p>
            </div>
          </Link>
          <Link
            href={"/protected/watch-history"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("watch-history")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
              </svg>
              <p className="text-lg">History</p>
            </div>
          </Link>
          <Link
            href={"/protected/liked-posts"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("liked-posts")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
              </svg>
              <p className="text-lg">Liked posts</p>
            </div>
          </Link>
          <Link
            href={"/protected/saved-posts"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("saved-posts")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
              </svg>
              <p className="text-lg">Saved posts</p>
            </div>
          </Link>
          <Link
            href={"/protected/watch-list"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("watch-list")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" />
              </svg>
              <p className="text-lg">Watch list</p>
            </div>
          </Link>
          <Link
            href={"/protected/watch-later"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("watch-later")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
              </svg>
              <p className="text-lg">Watch later</p>
            </div>
          </Link>
          <Link
            href={"/blog"}
            className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
              pathname.includes("blog")
                ? `bg-primary/10 text-primary`
                : `text-foreground`
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-current"
              >
                <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
              </svg>
              <p className="text-lg">Watch later</p>
            </div>
          </Link>
        </ul>
        <div className="mx-auto h-[1px] w-[90%] bg-foreground/20"></div>
      </div>
    </>
  );
}

export default TopNavbarDesktop;
