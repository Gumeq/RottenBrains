"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/searchBar/SearchBar";
import { useUser } from "@/context/UserContext";
import ProfilePictureNew from "@/components/navigation/ProfilePictureNew";
import useLocalStorage from "@/utils/customHooks/useLocalStorage";
import { useSidebar } from "@/context/SidebarContext";

const HomeNav = ({ children }: any) => {
  const pathname = usePathname();
  const { user } = useUser();

  const { isSidebarOpen, toggleSidebar } = useSidebar(); // Destructure from context

  return (
    <nav
      className={`fixed top-0 z-30 hidden h-16 w-screen items-center justify-center bg-background lg:flex`}
    >
      <div className="flex flex-col items-center">
        <div className="flex w-screen flex-row items-center justify-between gap-10 pl-4 pr-8">
          <div className="flex flex-row items-center gap-8">
            <button onClick={toggleSidebar} className="rounded-full">
              <img
                src="/assets/icons/menu.svg"
                alt="menu-icon"
                width={24}
                height={24}
                className="invert-on-dark"
              />
            </button>
            <Link href={"/"} className="flex flex-row items-center gap-2">
              <img
                src="/assets/images/logo_new_black.svg"
                alt="text-logo"
                className="invert-on-dark h-6 w-auto"
              />
              {user && user.premium ? (
                <p className="text-xl font-black">Premium</p>
              ) : (
                <p className="text-xl font-black">Rotten Brains</p>
              )}
            </Link>
          </div>

          <div className="h-full w-screen p-2 lg:max-w-[600px] lg:p-0">
            <SearchBar link={true} user={true}></SearchBar>
          </div>

          {user ? (
            <div className="flex flex-row items-center gap-4">
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
              <Link
                href={"/protected/settings"}
                className={` ${
                  pathname.includes("settings")
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
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg>
              </Link>
              {/* <NotificationButton></NotificationButton> */}
              <div className="flex items-center">
                <ProfilePictureNew></ProfilePictureNew>
              </div>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="flex flex-row items-center gap-2 rounded-lg bg-foreground/10 px-4 py-2"
            >
              <img
                src="/assets/icons/account-circle-outline.svg"
                className="invert-on-dark"
                alt=""
              />
              <p>Sign in</p>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;
