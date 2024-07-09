"use client";

import { IPost } from "@/types";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getUserFromDB } from "@/utils/supabase/queries";
import React from "react";
import SaveButton from "./SaveButton";
import LikeButton from "./LikeButton";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture";
import PostLikedNumber from "./PostLikedNumber";
import UserReviewText from "./UserReviewText";
import { timeAgo } from "./TimeAgo";
import ViewComments from "./ViewComments";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HomePostCard({ post, index }: any) {
	const media_id = post.mediaid;
	const media_type = post.media_type;

	const [media, setMedia] = useState<any>(null);
	const [creator, setCreator] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const fetchedMediaData = await fetchMediaData(
					media_type,
					media_id
				);
				setMedia(fetchedMediaData);
			} catch (error) {
				console.error("Error fetching media data:", error);
				setError("Error fetching media data");
				setMedia(null);
			}

			try {
				const fetchedCreator = await getUserFromDB(post.creatorid);
				setCreator(fetchedCreator);
			} catch (error) {
				console.log("Error fetching creator data:", error);
				setError("Error fetching creator data");
				setCreator(null);
			}

			setLoading(false);
		};

		fetchData();
	}, [media_type, media_id, post.creatorid]);

	const variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	if (loading) {
		return;
	}

	if (error) {
		return;
	}
	return (
		<motion.div
			className="relative rounded-[16px] overflow-hidden border border-foreground/30 "
			variants={variants}
			initial="hidden"
			animate="visible"
			transition={{
				delay: index * 0.15,
				ease: "easeInOut",
				duration: 0.25,
			}}
			viewport={{ amount: 0 }}
		>
			{/* <div className="absolute inset-0 bg-cover bg-center bg-opacity-50 blur-sm ">
				{media && (
					<img
						src={`https://image.tmdb.org/t/p/w500${media.backdrop_path}`}
						alt="Background Image"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							objectPosition: "center",
							position: "absolute",
							top: 0,
							left: 0,
						}}
					/>
				)}
			</div>
			<div className="absolute inset-0 bg-background opacity-80"></div> */}
			<div className="w-screen md:w-[350px]  max-w-[calc(100vw-20px)] flex flex-col bg-foreground/5 relative">
				{/* <div className="w-full h-[50px] flex items-center align-center px-4 border-b border-foreground/30">
					<div className="flex flex-row items-center justify-between w-full">
						<div>
							<img
								src="/assets/icons/ellipsis-solid.svg"
								alt=""
								width={20}
								height={20}
								className="invert-on-dark"
								style={{
									width: "20px",
									height: "20px",
								}}
							/>
						</div>
					</div>
				</div> */}
				<div className="flex flex-col relative overflow-hidden rounded-xl">
					<div className=" flex flex-row gap-4 items-center  p-2 px-4 ">
						<span className="min-w-[35px] min-h-[35px] ">
							<ProfilePicture
								userId={creator?.user.id}
							></ProfilePicture>
						</span>
						<div>
							<p className="line-clamp-1">
								<span className="font-bold text-lg">
									{creator.user.username}
								</span>{" "}
								watched{" "}
								<span className="text-lg font-bold hover:underline">
									<Link
										href={`/protected/media/${media_type}/${media_id}`}
									>
										{media && (media.title || media.name)}
									</Link>
								</span>
							</p>
							<p className="text-sm opacity-50">
								{timeAgo(post.created_at)}
							</p>
						</div>
					</div>
					<div className="relative my-auto flex flex-col gap-4 p-2">
						<div className="flex flex-col z-10 gap-2">
							<div className=" w-[320px] h-[480px] mx-auto">
								{media && (
									<div className="rounded-[8px]  overflow-hidden">
										<div className="absolute p-2 text-lg m-2 font-bold bg-background/50 flex flex-row gap-2 items-center justify-center rounded-[6px]">
											<img
												src="/assets/icons/star-solid.svg"
												alt=""
												width={20}
												height={20}
												className="invert-on-dark"
												loading="lazy"
											/>
											<p>{post.vote_user}</p>
										</div>
										<Link
											href={`/protected/media/${media_type}/${media_id}`}
										>
											<img
												src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
												alt=""
												width={400}
												height={600}
												className="min-h-[300px] min-w-[200px] mx-auto"
											/>
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className=" mx-4 px-2 py-2  rounded-[8px]">
					<UserReviewText
						post_review={post.review_user || "no review"}
						creator_name={creator?.user.username || "no user"}
					></UserReviewText>
				</div>
				<div className="w-full h-[50px] px-4">
					<div className="flex flex-row gap-2 align-center w-full h-full justify-between items-center">
						<div className="flex flex-row items-center">
							<LikeButton postId={post.id}></LikeButton>
							<ViewComments postId={post.id}></ViewComments>
						</div>
						<SaveButton postId={post.id}></SaveButton>
					</div>
				</div>
				<div className="px-4 pb-2">
					<p className="font-bold text-xl text-foreground/50">
						<PostLikedNumber postId={post.id}></PostLikedNumber>{" "}
						<span className=" font-base text-base">likes</span>
					</p>
				</div>
			</div>
		</motion.div>
	);
}

export default HomePostCard;
