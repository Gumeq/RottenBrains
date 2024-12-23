"use client";

import React, { useState, useRef, useEffect } from "react";
import SearchBar from "@/components/searchBar/SearchBar";

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
        className="flex flex-1 flex-col items-center justify-center text-xs opacity-80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40px"
          viewBox="0 -960 960 960"
          width="40px"
          fill="#000000"
          className="invert-on-dark rounded-full p-2"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
        <p>Search</p>
      </button>

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
