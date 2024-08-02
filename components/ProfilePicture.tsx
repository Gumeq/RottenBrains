import { getUserFromDB } from "@/utils/supabase/queries";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfilePicture = ({ user }: any) => {
	// const [loading, setLoading] = useState<boolean>(true);
	// const [error, setError] = useState<string | null>(null);

	// useEffect(() => {
	// 	const fetchUser = async () => {
	// 		setLoading(true);
	// 		setError(null);

	// 		try {
	// 			const fetchedUser = await getUserFromDB(userId);
	// 			setUser(fetchedUser);
	// 		} catch (error) {
	// 			console.error("Error fetching user data:", error);
	// 			setError("Error fetching user data");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchUser();
	// }, [userId]);

	return (
		<div>
			{user && (
				<div>
					<Link href={`/protected/user/${user.id}`}>
						<img
							src={user.image_url}
							alt={"prof-pic"}
							width={35}
							height={35}
							className="rounded-full overflow-hidden max-w-[35px] max-h-[35px] bg-foreground/20"
						></img>
					</Link>
				</div>
			)}
		</div>
	);
};

export default ProfilePicture;
