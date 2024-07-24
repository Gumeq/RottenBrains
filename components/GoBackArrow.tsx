"use client";
import { useRouter } from "next/navigation";
import React from "react";

const GoBackArrow = () => {
	const router = useRouter();

	return (
		<button onClick={() => router.back()}>
			<img
				src="/assets/icons/arrow-back.svg"
				alt=""
				className="w-6 h-6 invert"
			></img>
		</button>
	);
};

export default GoBackArrow;
