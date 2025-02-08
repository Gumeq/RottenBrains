"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../features/navigation/desktop/Sidebar";
import { useSidebar } from "@/hooks/SidebarContext";
import NavBottom from "../features/navigation/mobile/NavBottom";
import TopLoader from "../features/loaders/TopLoader";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useSidebar(); // client-only context
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true only on the client
    setMounted(true);
  }, []);

  // Use a default value until the component is mounted.
  // Assume that on the server isSidebarOpen is false.
  const mainPaddingClass = mounted
    ? isSidebarOpen
      ? "ml-64 max-w-[calc(100vw-256px)]"
      : "ml-24 max-w-[calc(100vw-96px)]"
    : "ml-24 max-w-[calc(100vw-96px)]";

  return (
    <>
      <div className="hidden md:flex">
        <Sidebar />
        <main
          className={`mt-20 w-full flex-1 pl-4 pr-8 transition-all duration-300 ${mainPaddingClass}`}
        >
          {children}
        </main>
      </div>
      <div className="flex md:hidden">
        <main className="w-full flex-1 transition-all duration-300">
          {children}
        </main>
        <NavBottom />
      </div>
    </>
  );
};

export default MainContent;
