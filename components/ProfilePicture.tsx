"use client";

import { getUserFromDB } from "@/utils/supabase/queries";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type ProfilePictureProps = {
	userId: string;
};

const ProfilePicture = ({ userId }: ProfilePictureProps) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			setError(null);

			try {
				const fetchedUser = await getUserFromDB(userId);
				setUser(fetchedUser);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setError("Error fetching user data");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	return (
		<div>
			{loading ? (
				<Skeleton
					circle
					height={35}
					width={35}
					baseColor="#d1d5db"
					highlightColor="#e5e7eb"
				/>
			) : error ? (
				<div>Error loading profile picture</div>
			) : (
				user && (
					<div>
						<Link href={`/protected/user/${userId}`}>
							<img
								src={user.user.imageURL}
								alt={""}
								width={35}
								height={35}
								className="rounded-full overflow-hidden max-w-[35px] max-h-[35px]"
							></img>
						</Link>
					</div>
				)
			)}
		</div>
	);
};

export default ProfilePicture;
