import Bottombar from "@/components/navigation/Bottombar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import TopNavbarDesktop from "@/components/navigation/TopNavDesktop";
import MobileTopNav from "@/components/navigation/MobileTopNav";
import HomeNav from "./home/HomeNav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
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
