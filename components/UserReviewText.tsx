"use client";

import React, { useEffect, useRef, useState } from "react";

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
		// Calculate number of lines dynamically
		if (textRef.current) {
			const lineHeight = parseInt(
				getComputedStyle(textRef.current).lineHeight || "0",
				10
			);
			const maxHeight = lineHeight * 1; // Adjust this based on the number of lines you want to show initially
			const isOverflowing = textRef.current.scrollHeight > maxHeight;
			setShowMoreIndicator(isOverflowing);
		}
	}, []);

	const toggleExpanded = () => {
		setExpanded(!expanded);
	};

	const initialText = (
		<p>
			<span className="font-bold">{creator_name}</span> {post_review}
		</p>
	);

	return (
		<div className="overflow-hidden">
			<div ref={textRef} className={`${expanded ? "" : "line-clamp-1"}`}>
				{initialText}
			</div>
			{showMoreIndicator && !expanded && (
				<button
					className="text-foreground/50 hover:underline focus:outline-none"
					onClick={toggleExpanded}
				>
					Show more
				</button>
			)}
			{expanded && (
				<button
					className="text-foreground/50 hover:underline focus:outline-none"
					onClick={toggleExpanded}
				>
					Show less
				</button>
			)}
		</div>
	);
};

export default UserReviewText;
