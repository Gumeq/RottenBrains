import Link from "next/link";
import React from "react";

const UserCard = ({ user }: any) => {
	return (
		<Link href={`/protected/user/${user.id}`}>
			<div className="bg-foreground/10 p-2 rounded flex flex-row gap-2 items-center">
				<div>
					<img
						src={user.imageURL}
						alt=""
						width={30}
						height={30}
						className="max-w-[30px] max-h-[30px] rounded-full"
					/>
				</div>
				<p>{user.username}</p>
			</div>
		</Link>
	);
};

export default UserCard;
