"use client";

import { IPost } from "@/types";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import React, { useEffect, useState, useMemo } from "react";
import SaveButton from "./SaveButton";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture";
import UserReviewText from "./UserReviewText";
import { timeAgo } from "./TimeAgo";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@/context/UserContext";
import PostStats from "./PostStats";
import UserReviewTextNew from "./UserReviewTextNew";

const LoadingSkeleton = ({ index }: any) => {
	const variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	return (
		<motion.div
			className="relative rounded-[16px] overflow-hidden border border-foreground/30"
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
			<div className="w-screen md:w-[350px] max-w-[calc(100vw-20px)] flex flex-col bg-foreground/5 relative">
				<div className="flex flex-col relative overflow-hidden rounded-xl">
					<div className="flex flex-row gap-4 items-center p-2 px-4">
						<Skeleton
							circle
							height={35}
							width={35}
							baseColor="#212121"
							highlightColor="#323232"
						/>
						<div>
							<Skeleton
								width={120}
								baseColor="#212121"
								highlightColor="#323232"
							/>
							<Skeleton
								width={80}
								baseColor="#212121"
								highlightColor="#323232"
							/>
						</div>
					</div>
					<div className="relative my-auto flex flex-col gap-4 p-2">
						<div className="flex flex-col z-10 gap-2">
							<Skeleton
								height={480}
								width={320}
								baseColor="#212121"
								highlightColor="#323232"
							/>
						</div>
					</div>
				</div>
				<div className="mx-4 px-2 py-2 rounded-[8px]">
					<Skeleton
						count={3}
						baseColor="#212121"
						highlightColor="#323232"
					/>
				</div>
				<div className="w-full h-[50px] px-4">
					<div className="flex flex-row gap-2 align-center w-full h-full justify-between items-center">
						<Skeleton
							width={30}
							height={30}
							baseColor="#212121"
							highlightColor="#323232"
						/>
						<Skeleton
							width={30}
							height={30}
							baseColor="#212121"
							highlightColor="#323232"
						/>
					</div>
				</div>
				<div className="px-4 pb-2">
					<Skeleton
						width={60}
						baseColor="#212121"
						highlightColor="#323232"
					/>
				</div>
			</div>
		</motion.div>
	);
};

const ErrorComponent = () => <div>Error loading post.</div>;

export function HomePostCardNew({ post, index }: any) {
	const media_id = post.media_id;
	const media_type = post.media_type;
	const [media, setMedia] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { user: currentUser } = useUser();

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const fetchedMediaData = await fetchMediaData(
					media_type,
					media_id
				);
				if (isMounted) {
					setMedia(fetchedMediaData);
				}
			} catch (error) {
				console.error("Error fetching media data:", error);
				if (isMounted) {
					setError("Error fetching media data");
					setMedia(null);
				}
			}

			if (isMounted) {
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [media_type, media_id]);

	const variants = useMemo(
		() => ({
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		}),
		[]
	);

	if (!currentUser) {
		return <p>no current user</p>;
	}

	const userId = currentUser.id;

	const creator = {
		id: post.creatorid,
		email: post.creator_email,
		image_url: post.creator_image_url,
		name: post.creator_name,
		username: post.creator_username,
	};

	if (!creator) {
		return <p>no creator</p>;
	}

	if (loading) {
		return <LoadingSkeleton index={index} />;
	}

	if (error) {
		return <ErrorComponent />;
	}

	return (
		<motion.div
			className="relative rounded-[16px] border border-foreground/10 p-4 max-w-2xl w-screen flex flex-col "
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
			<div className="flex flex-row gap-4 items-center justify-between mb-4">
				<div className="flex flex-row items-center gap-2">
					<span className="min-w-[35px] min-h-[35px]">
						<ProfilePicture user={creator} />
					</span>
					<div>
						<p className="line-clamp-1">
							<span className="font-bold">
								{creator.username}
							</span>{" "}
							watched{" "}
							<span className="font-bold hover:underline">
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
				<div>
					{post.creatorid === userId && (
						<Link href={`/protected/edit-post/${post.id}`}>
							<img
								src="/assets/icons/ellipsis-solid.svg"
								alt=""
								width={20}
								height={20}
								className="invert-on-dark justify-self-end min-w-[20px] min-h-[20px] mr-2"
							/>
						</Link>
					)}
				</div>
			</div>
			<div className="w-full flex flex-row justify-between gap-4 mb-4">
				<div className=" w-full">
					<UserReviewTextNew
						post_review={post.review_user || "no review"}
						creator_name={creator?.username || "no user"}
					/>
				</div>
				<Link href={`/protected/media/${media_type}/${media_id}`}>
					<img
						src={`https://image.tmdb.org/t/p/w154${media.poster_path}`}
						alt=""
						className="min-w-[154px] aspect-[2/3] rounded-[14px]"
					/>
				</Link>
			</div>
			<div className="w-full flex items-center">
				<div className="flex flex-row align-center w-full h-full justify-between items-center">
					<div className="flex flex-row items-center">
						<PostStats post={post} user={currentUser}></PostStats>
					</div>
					<div className="flex flex-row gap-4 items-center">
						<SaveButton post={post} />
						<Link
							className=""
							href={`/protected/create-post/${media_type}/${media_id}`}
						>
							<img
								src="/assets/icons/add-circle-outline.svg"
								alt=""
								width={30}
								height={30}
								className="invert-on-dark"
							/>
						</Link>
						<Link
							className=""
							href={`/protected/create-post/${media_type}/${media_id}`}
						>
							<img
								src="/assets/icons/share-solid.svg"
								alt=""
								width={30}
								height={30}
								className="invert-on-dark"
							/>
						</Link>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default HomePostCardNew;
