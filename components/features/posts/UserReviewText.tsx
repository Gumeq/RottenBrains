"use client";

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";

interface UserReviewProps {
  post_review: string;
  post_link: string;
}

const UserReviewText = ({
  post_review,
  post_link,
}: UserReviewProps): React.JSX.Element => {
  return (
    <Link
      href={post_link || "/"}
      className="flex min-h-[50px] flex-col gap-2 text-sm"
    >
      <p
        className={classNames(
          "line-clamp-1 overflow-hidden text-foreground/80",
        )}
      >
        {post_review}
      </p>
      <p className="text-xs text-foreground/50">Show more</p>
    </Link>
  );
};

export default UserReviewText;
