"use client";

import FollowButton from "@/components/post/FollowButton";
import { getNewestUsers } from "@/utils/supabase/queries";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FollowUsers = () => {
	const [users, setUsers] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			try {
				const data = await getNewestUsers();
				if (data) {
					setUsers(data);
					console.log("Fetched users:", data);
				}
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoading(false);
			}
		};

		getUsers();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<ul className="flex flex-row gap-2 overflow-x-auto custom-scrollbar py-2">
				{users.map((user: any) => (
					<li
						key={user.id}
						className="p-4 border border-foreground/20 rounded-[4px] flex flex-col items-center justify-center gap-2 min-w-[150px]"
					>
						<Link href={`/protected/user/${user.id}`}>
							<img
								src={user.imageURL}
								alt=""
								width={100}
								height={100}
								className="max-w-[100px] max-h-[100px] rounded-full"
							/>
						</Link>
						<Link href={`/protected/user/${user.id}`}>
							<p className="font-bold text-lg truncate">
								{user.username}
							</p>
						</Link>
						<FollowButton
							user_to_follow_id={user.id}
						></FollowButton>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FollowUsers;
