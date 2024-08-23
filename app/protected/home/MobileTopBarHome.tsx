"use client";

import NotificationButton from "@/components/notifications/RealtimeNotifications";
import React, { useState, useEffect } from "react";

const MobileTopBarHome = () => {
  const [show, setShow] = useState(true); // Initially show the top bar
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // if scroll down hide the navbar
        setShow(false);
      } else {
        // if scroll up show the navbar
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-background px-4 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0 transform" : "-translate-y-full transform"
      }`}
    >
      <h1 className="text-lg font-black text-foreground">RottenBrains</h1>
      <div className="flex flex-row gap-4">
        <NotificationButton></NotificationButton>
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
      </div>
    </div>
  );
};

export default MobileTopBarHome;
