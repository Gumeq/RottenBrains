"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import ThemeSwitch from "../ThemSwitch";
import Link from "next/link";

const ProfilePicture = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
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
        className="mr-1 aspect-[1/1] h-8 cursor-pointer rounded-full"
        onClick={handleToggleDropdown}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-10 mt-2 w-[250px] rounded-md border border-foreground/10 bg-background shadow-lg"
        >
          <div className="py-2">
            <Link
              href="/protected/profile"
              className="flex flex-row justify-between px-4 py-2 hover:bg-accent/20"
            >
              <p>Profile</p>
              <img
                src="/assets/icons/person-outline.svg"
                alt=""
                className="invert-on-dark"
              />
            </Link>
            <Link
              href="/protected/settings"
              className="flex flex-row justify-between px-4 py-2 hover:bg-accent/20"
            >
              <p>Settings</p>
              <img
                src="/assets/icons/settings-outline.svg"
                alt=""
                className="invert-on-dark"
              />
            </Link>
            <div className="flex w-full items-center px-4 py-2 hover:bg-accent/20">
              <ThemeSwitch></ThemeSwitch>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
