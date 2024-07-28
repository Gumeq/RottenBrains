"use client"; // Ensure this is a client component

import React from "react";

const ScrollButtons = ({
	containerId,
	scrollPercent = 50,
}: {
	containerId: string;
	scrollPercent?: number;
}) => {
	const scrollLeft = () => {
		const scrollContainer = document.getElementById(containerId);
		if (scrollContainer) {
			const scrollAmount = (window.innerWidth * scrollPercent) / 100;
			scrollContainer.scrollBy({
				top: 0,
				left: -scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		const scrollContainer = document.getElementById(containerId);
		if (scrollContainer) {
			const scrollAmount = (window.innerWidth * scrollPercent) / 100;
			scrollContainer.scrollBy({
				top: 0,
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="lg:flex flex-row gap-4 hidden">
			<button
				onClick={scrollLeft}
				className="bg-foreground/10 p-2 rounded-full z-10 hover:scale-105 drop-shadow-lg "
			>
				<img
					src="/assets/icons/chevron-back.svg"
					alt=""
					className="w-4 h-4 invert aspect-[1/1]"
				/>
			</button>
			<button
				onClick={scrollRight}
				className="bg-foreground/10 p-2 rounded-full z-10 hover:scale-105 drop-shadow-lg"
			>
				<img
					src="/assets/icons/chevron-forward.svg"
					alt=""
					className="w-4 h-4 invert aspect-[1/1]"
				/>
			</button>
		</div>
	);
};

export default ScrollButtons;
