"use client";

import React, { useState, useRef, useEffect } from "react";
import SearchBar from "@/components/searchBar/SearchBar";
import { SearchIcon } from "./Icon";

const SearchIconWithOverlay: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Search Icon */}
      <button
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open Search"
        className="flex flex-1 flex-col items-center justify-center gap-1 opacity-80"
      >
        <div
          className={`flex w-full flex-col items-center justify-center rounded-full`}
        >
          <SearchIcon className="fill-current" width={28} height={28} />
        </div>
        <p className="text-xs">Search</p>
      </button>
      {/* <Link
        href={href}
        className={`flex flex-1 flex-col items-center justify-center gap-1 opacity-80`}
      >
        <div
          className={`flex w-full flex-col items-center justify-center rounded-full ${
            isActive ? `bg-secondary/20 text-accent` : `text-foreground`
          }`}
        >
          {isActive && IconFill ? (
            <IconFill className="fill-current" width={28} height={28} />
          ) : (
            <Icon className="fill-current" width={28} height={28} />
          )}
        </div>
        {label && <p className="text-xs">{label}</p>}
      </Link> */}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed left-0 top-0 z-30 flex h-full w-full flex-col bg-background p-4">
          <div className="z-40 flex items-center justify-between gap-4">
            <button
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close Search"
              className="text-lg"
            >
              X
            </button>
            <div className="z-30 mt-12 w-full">
              <SearchBar ref={searchBarRef} link={true} user={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchIconWithOverlay;
