import Loader from "@/components/Loader";
import React from "react";

const loading = () => {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Loader></Loader>
		</div>
	);
};

export default loading;
