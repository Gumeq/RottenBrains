import PostForm from "@/components/frorms/PostForm";
import React from "react";

const page = () => {
	return (
		<div className="w-screen">
			<PostForm action="Create"></PostForm>
		</div>
	);
};

export default page;
