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
      ? "pl-64"
      : "pl-24"
    : "pl-24";

  return (
    <>
      <div className="hidden lg:flex">
        <Sidebar />
        <main
          className={`mt-16 w-full flex-1 px-4 pr-8 transition-all duration-300 ${mainPaddingClass}`}
        >
          {children}
        </main>
      </div>
      <div className="flex lg:hidden">
        <main className="w-full flex-1 transition-all duration-300">
          {children}
        </main>
        <NavBottom />
      </div>
    </>
  );
};

export default MainContent;
