"use client";

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";

interface UserReviewProps {
  post_review: string;
  creator_name: string;
}

const UserReviewText = ({
  post_review,
  creator_name,
}: UserReviewProps): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { clientHeight, scrollHeight } = textRef.current;
      if (scrollHeight > clientHeight) {
        setShowButton(true);
      }
    }
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-[50px] text-sm">
      <div
        ref={textRef}
        className={classNames(
          "overflow-hidden opacity-80",
          { "line-clamp-none": isExpanded },
          { "line-clamp-[1]": !isExpanded },
        )}
      >
        {post_review}
      </div>
      {showButton && (
        <button
          className="mt-2 text-foreground/50 hover:text-foreground/80"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default UserReviewText;
