"use client";

import { useRouter } from "next/navigation";
import React from "react";

const GetStartedButton: React.FC = () => {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push("/protected/home")}
			className="px-4 py-2 bg-accent text-white rounded text-xl font-bold"
		>
			Get Started
		</button>
	);
};

export default GetStartedButton;
