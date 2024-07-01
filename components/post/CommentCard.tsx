"use client";
import { getUserFromDB } from "@/utils/supabase/queries";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { timeAgo } from "./TimeAgo";

const CommentCard = ({ comment }: any) => {
	const [creator, setCreator] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const user = await getUserFromDB(comment.user_id);
				setCreator(user.user);
				console.log(user);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCreator();
	}, [comment]);

	return (
		<div className="w-full">
			{!loading && (
				<div className="p-2 flex flex-row gap-4 w-11/12 ">
					<div className="">
						<Image
							src={creator.imageURL}
							alt={" "}
							width={30}
							height={30}
							className="rounded-full w-[30px] h-[30px]"
						></Image>
					</div>
					<div className="flex flex-col w-10/12">
						<div className="flex flex-row gap-2 items-center">
							<p className="font-bold text-sm">
								{creator.username}
							</p>
							<p className="text-xs">
								{timeAgo(comment.created_at)}
							</p>
						</div>
						<div className="break-words">
							<p className="text-sm whitespace-pre-wrap ">
								{comment.content}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CommentCard;
