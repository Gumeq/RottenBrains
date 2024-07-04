import { getUserFromDB } from "@/utils/supabase/queries";

import Link from "next/link";
import React from "react";

type ProfilePictureProps = {
	userId: string;
};

const ProfilePicture = async ({ userId }: ProfilePictureProps) => {
	const user = await getUserFromDB(userId);
	return (
		<div>
			{user && (
				<div>
					<Link href={`/protected/user/${userId}`}>
						<img
							src={user.user.imageURL}
							alt={""}
							width={35}
							height={35}
							className="rounded-full overflow-hidden"
						></img>
					</Link>
				</div>
			)}
		</div>
	);
};

export default ProfilePicture;
