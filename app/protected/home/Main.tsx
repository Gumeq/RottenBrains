"use client";

// src/components/MainContent.tsx
import React from "react";
import Sidebar from "./sidebar";
import { useSidebar } from "@/context/SidebarContext";
import Bottombar from "@/components/navigation/Bottombar";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useSidebar(); // Destructure from context
  return (
    <>
      <div className="hidden lg:flex">
        <Sidebar />
        <main
          className={`mt-16 w-full flex-1 px-4 pr-8 transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-24"}`}
        >
          {children}
        </main>
      </div>
      <div className="flex lg:hidden">
        <main
          className={`min-h-screen w-full flex-1 transition-all duration-300`}
        >
          {children}
        </main>
        <Bottombar />
      </div>
    </>
  );
};

export default MainContent;
