"use client";

import Image from "next/image";
import { useCallback } from "react";

const ScrollButton: React.FC = () => {
	const handleScrollDown = useCallback(() => {
		window.scrollBy({
			top: window.innerHeight,
			behavior: "smooth",
		});
	}, []);

	return (
		<button
			onClick={handleScrollDown}
			className="mt-10 px-6 py-3 hover:bg-accent rounded-full  downUpAnimation"
		>
			<Image
				src={"/assets/icons/arrow-down-solid.svg"}
				alt={"arrow-down"}
				width={30}
				height={30}
				className="invert"
			></Image>
		</button>
	);
};

export default ScrollButton;
