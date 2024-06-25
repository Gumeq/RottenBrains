import { getCurrentUser, getUserFromDB } from "@/utils/supabase/queries";
import Image from "next/image";
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
						<Image
							src={user.user.imageURL}
							alt={""}
							width={35}
							height={35}
							className="rounded-full overflow-hidden"
						></Image>
					</Link>
				</div>
			)}
		</div>
	);
};

export default ProfilePicture;
