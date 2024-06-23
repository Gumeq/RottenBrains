import { IPost } from "@/types";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getUserFromDB } from "@/utils/supabase/queries";
import { Divide } from "lucide-react";
import Image from "next/image";
import React from "react";
import SaveButton from "./SaveButton";
import LikeButton from "./LikeButton";
import Link from "next/link";

export async function HomePostCard({ post }: any) {
	const media_id = post.mediaid;
	const media_type = post.media_type;

	let mediaData;
	try {
		mediaData = await fetchMediaData(media_type, media_id);
	} catch (error) {
		console.error("Error fetching media data:", error);
		mediaData = null;
	}
	const media = mediaData;

	let creator;
	try {
		creator = await getUserFromDB(post.creatorid);
	} catch (error) {
		console.log(error);
		creator = null;
	}

	return (
		<div className="w-screen h-[460px] md:w-[350px]  flex flex-col">
			<div className="w-full h-[50px] flex items-center align-center px-2">
				<div className="flex flex-row gap-2 items-center">
					{creator && (
						<div className="">
							<Image
								src={creator.user.imageURL}
								alt={""}
								width={35}
								height={35}
								className="rounded-full overflow-hidden"
							></Image>
						</div>
					)}
					<div>
						<p className="font-bold text-lg truncate">
							{creator?.user.username}
						</p>
					</div>
				</div>
			</div>
			<div className=" h-[360px] p-4 flex flex-col relative ">
				<div className="absolute inset-0 bg-cover bg-center bg-opacity-50">
					{/* Use next/image for the background image */}
					{media && (
						<Image
							src={`https://image.tmdb.org/t/p/w500${media.backdrop_path}`}
							alt="Background Image"
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							className=" blur-sm desaturate"
						/>
					)}
				</div>
				<div className="absolute inset-0 bg-background opacity-80"></div>
				<div className="relative">
					<div className="flex flex-row z-10">
						<div className="">
							{media && (
								<div>
									<div className="h-[180] pr-2">
										<Image
											src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
											alt={""}
											width={120}
											height={180}
											className="rounded-lg overflow-hidden"
										></Image>
									</div>
								</div>
							)}
						</div>
						<div className="">
							<div className="flex flex-row gap-2 items-center">
								<Link
									href={`/protected/media/${media_type}/${media_id}`}
								>
									{media && (
										<p className="font-bold text-lg truncate">
											{media.title || media.name}
										</p>
									)}
								</Link>
							</div>
							{media && (
								<div className="flex flex-col gap-1">
									<div className="flex flex-row items-center gap-2 pb-2">
										<p className="text-xs text-foreground/70 ">
											{media.release_date?.slice(0, 4) ||
												media.first_air_date?.slice(
													0,
													4
												)}
										</p>
										{media.number_of_seasons && (
											<p className="text-sm text-foreground/70">
												({media.number_of_seasons}{" "}
												Seasons)
											</p>
										)}
									</div>
									<div>
										<p className="text-xs">Avg rating:</p>
										<p className="text-lg font-bold">
											{media.vote_average.toFixed(0)}{" "}
											<span className="text-xs">/10</span>
										</p>
									</div>
									<div>
										<p className="text-xs">User rating:</p>
										<p className="text-5xl font-bold text-accent">
											{post.vote_user.toFixed(0)}{" "}
											<span className="text-xs text-foreground">
												/10
											</span>
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="">
						<p className="pt-4">"{post.review_user}"</p>
					</div>
				</div>
			</div>
			<div className="w-full h-[50px] ">
				<div className="flex flex-row gap-4 align-center w-full h-full px-4 justify-between">
					{/* <HomePostCardStats post={post}></HomePostCardStats> */}
					<LikeButton postId={post.id}></LikeButton>
					<SaveButton postId={post.id}></SaveButton>
				</div>
			</div>
		</div>
	);
}

export default HomePostCard;
