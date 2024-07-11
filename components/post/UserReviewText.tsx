"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

type UserReviewProps = {
	post_review: string;
	creator_name: string;
};

const UserReviewText = ({
	post_review,
	creator_name,
}: UserReviewProps): React.JSX.Element => {
	const [expanded, setExpanded] = useState(false);
	const [showMoreIndicator, setShowMoreIndicator] = useState(false);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Calculate if the text overflows
		if (textRef.current) {
			const isOverflowing =
				textRef.current.scrollWidth > textRef.current.clientWidth;
			setShowMoreIndicator(isOverflowing);
		}
	}, [post_review, expanded]);

	const toggleExpanded = () => {
		setExpanded(!expanded);
	};

	return (
		<div className="w-full relative">
			<div
				ref={textRef}
				className={classNames("overflow-hidden", {
					"whitespace-nowrap text-ellipsis": !expanded,
					"pr-10": showMoreIndicator && !expanded, // Conditional padding
				})}
			>
				{post_review}
				{showMoreIndicator && !expanded && (
					<button
						className="absolute right-0  text-foreground/60 hover:underline focus:outline-none ml-1"
						onClick={toggleExpanded}
					>
						more
					</button>
				)}
				{expanded && (
					<button
						className=" hover:underline focus:outline-none ml-1 text-foreground/60"
						onClick={toggleExpanded}
					>
						Show less
					</button>
				)}
			</div>
		</div>
	);
};

export default UserReviewText;
