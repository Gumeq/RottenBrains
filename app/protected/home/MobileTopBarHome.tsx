"use client";

import NotificationButton from "@/components/notifications/RealtimeNotifications";
import SearchBar from "@/components/searchBar/SearchBar";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const MobileTopBarHome = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null); // Specify HTMLInputElement type

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  useEffect(() => {
    // Focus the SearchBar input when the overlay is opened
    if (isSearchOpen && searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Top bar */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-12 w-full items-center justify-between border-b border-foreground/20 bg-background px-4 transition-transform duration-100 lg:hidden ${
          show ? "translate-y-0 transform" : "-translate-y-full transform"
        }`}
      >
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
        <div className="flex flex-row gap-4">
          <NotificationButton />
          <button onClick={() => setIsSearchOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
              className="invert-on-dark"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background p-4">
          <div className="z-50 mb-4 flex items-center justify-between gap-4">
            <button onClick={() => setIsSearchOpen(false)} className="text-lg">
              X
            </button>
            <div className="z-50 w-full">
              <SearchBar ref={searchBarRef} link={true} user={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTopBarHome;
