import ProfilePicture from "@/components/navigation/ProfilePicture";
import Link from "next/link";
import React from "react";

const BlogNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen">
      <nav className="fixed left-0 top-0 z-50 h-16 w-full bg-black">
        <div className="mx-auto flex h-full w-full max-w-[1500px] flex-row items-center justify-between px-4 py-2">
          <Link href={"/blog"} className="flex flex-row items-center gap-4">
            <img
              src="/assets/images/logo_new.svg"
              alt=""
              className="h-8 w-auto"
            />
            <p className="text-lg font-bold">Dev Blog</p>
          </Link>
          <div className="flex items-center">
            <ProfilePicture></ProfilePicture>
          </div>
        </div>
      </nav>
      <div className="mx-auto mt-16 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default BlogNav;
