"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/utils/supabase/signOut";
import ThemeSwitch from "../ThemSwitch";
import { useRouter } from "next/navigation";

const ProfilePicture = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Use router for redirection

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(); // Call the signOut function
    router.push("/login"); // Redirect to login after signing out
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <img
        src={user?.image_url}
        alt="User Avatar"
        className={`aspect-[1/1] h-8 cursor-pointer rounded-full`}
        onClick={handleToggleDropdown}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-10 mt-2 w-[250px] origin-top-right rounded-[8px] border border-foreground/10 bg-background shadow-lg"
        >
          <div className="bg-foreground/5 py-2">
            <div className="flex flex-row items-center gap-2 px-4 py-2">
              <img
                src={user?.image_url}
                alt="User Avatar"
                className="mr-1 aspect-[1/1] h-8 rounded-full"
              />
              <p className="truncate text-lg font-semibold">{user?.username}</p>
            </div>
            <div className="my-2 h-[1px] w-full bg-foreground/20"></div>
            <Link
              href="/protected/profile"
              className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-accent/20"
            >
              <img
                src="/assets/icons/person-outline.svg"
                alt="Profile Icon"
                className="invert-on-dark"
              />
              <p>Profile</p>
            </Link>
            <Link
              href="/protected/settings"
              className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-accent/20"
            >
              <img
                src="/assets/icons/settings-outline.svg"
                alt="Settings Icon"
                className="invert-on-dark"
              />
              <p>Settings</p>
            </Link>
            <div className="flex w-full items-center gap-2 px-4 py-2 hover:bg-accent/20">
              <ThemeSwitch />
            </div>
            <button
              className="flex w-full flex-row items-center gap-2 px-4 py-2 hover:bg-accent/20"
              onClick={handleSignOut} // Call handleSignOut on click
            >
              <img
                src="/assets/icons/logout.svg"
                alt="Settings Icon"
                className="invert-on-dark"
              />
              <p>Sign out</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
