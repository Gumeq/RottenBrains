"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface MyRedirectModalProps {
  userId: string; // The user ID to redirect to
  isOpen: boolean; // Whether the modal is visible
  children?: React.ReactNode;
}

/**
 * A simple client-side modal that locks body scrolling when open
 * and redirects to /protected/user/[userId] onClose.
 */
export default function PostModal({
  userId,
  isOpen,
  children,
}: MyRedirectModalProps) {
  const router = useRouter();

  // If `isOpen` is false, do not render anything
  if (!isOpen) return null;

  const handleClose = () => {
    router.replace(`/protected/user/${userId}`);
  };

  // 1. Lock body scrolling when the modal is open
  // 2. Restore scrolling when the modal closes (cleanup)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative max-h-[70vh] w-full max-w-[95vw] overflow-hidden rounded-[16px] bg-background shadow-lg lg:aspect-[4/3] lg:max-h-[90vh] lg:w-[60vw]">
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 flex aspect-square h-8 items-center justify-center text-lg font-semibold"
        >
          <p>&times;</p>
        </button>
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}
