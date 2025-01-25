import Bottombar from "@/components/navigation/Bottombar";
import React from "react";
import HomeNav from "../protected/home/HomeNav";

export default async function NotProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full"> </div>
      <div className="w-full overflow-x-hidden bg-background text-foreground md:flex">
        <div className="hidden lg:flex">
          <HomeNav>{children}</HomeNav>
        </div>
        {/* <MobileTopNav></MobileTopNav> */}
        <div className="flex w-full lg:hidden">
          <Bottombar />
          <div className="mb-16 w-full">{children}</div>
        </div>
      </div>
      {/* <div className="w-full h-[200px] "> </div> */}
    </div>
  );
}
