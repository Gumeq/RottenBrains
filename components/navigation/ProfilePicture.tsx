"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import React from "react";

const ProfilePicture = () => {
	const { user } = useUser();
	return (
		<div>
			<Link href={"/protected/profile"}>
				<img
					src={user?.imageURL}
					alt={""}
					width={35}
					height={35}
					className="rounded-full overflow-hidden max-w-[35px] max-h-[35px]"
				></img>
			</Link>
		</div>
	);
};

export default ProfilePicture;
