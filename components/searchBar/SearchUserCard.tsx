import Image from "next/image";
import Link from "next/link";
import React from "react";

const SearchUserCard = ({ user }: any) => {
	return (
		<Link href={`/protected/user/${user.id}`}>
			<div className="h-[100px] flex flex-row p-4 items-center gap-4 text-foreground">
				<div>
					<Image
						src={user.imageURL}
						alt={""}
						width={50}
						height={50}
						className="rounded-full overflow-hidden"
					></Image>
				</div>
				<p className="text-lg font-bold">{user.username}</p>
			</div>
		</Link>
	);
};

export default SearchUserCard;
