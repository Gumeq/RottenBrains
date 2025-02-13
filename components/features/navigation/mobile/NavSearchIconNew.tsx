"use client";
import { useState } from "react";
import { SearchIcon } from "@/components/ui/Icon";
import SearchModal from "./SearchModal";

export default function NavSearchIconNew() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      ></SearchModal>
    </>
  );
}
