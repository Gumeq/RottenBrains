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

export async function HomePostCard({ post }: any) {
	console.log(post);
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
		<div className="relative rounded-[20px] overflow-hidden border border-foreground/30 ">
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
				<div className="flex flex-col relative overflow-hidden rounded-xl p-2">
					<div className="relative my-auto flex flex-col gap-4 p-2">
						<div className="flex flex-col z-10 gap-2">
							<div className=" w-[320px] h-[480px] mx-auto">
								{media && (
									<div className="rounded-[12px]  overflow-hidden">
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
							<div className=" flex flex-row gap-4 items-center py-2">
								<span className="min-w-[35px] min-h-[35px] ">
									<ProfilePicture
										userId={creator?.user.id}
									></ProfilePicture>
								</span>
								<p className="">
									<span className="font-bold text-lg">
										{creator.user.username}
									</span>{" "}
									watched{" "}
									<span className="text-lg font-bold hover:underline">
										<Link
											href={`/protected/media/${media_type}/${media_id}`}
										>
											{media.title || media.name}
										</Link>
									</span>
								</p>
								{/* <p>
									<span className="flex flex-row gap-2 items-center">
										{creator && (
											<div className="">
												<ProfilePicture
													userId={creator?.user.id}
												></ProfilePicture>
											</div>
										)}
										<span>
											<p className="font-bold text-lg">
												{creator?.user.username}
											</p>
										</span>
										watched
									</span>
								</p>
								<div className="inline">
									{media && (
										<Link
											href={`/protected/media/${media_type}/${media_id}`}
										>
											<p className="font-bold text-lg hover:underline ">
												{media.title || media.name}
											</p>
										</Link>
									)}
								</div> */}

								{/* <div className="flex flex-row gap-2 items-center text-ellipsis">
									{media && (
										<Link
											href={`/protected/media/${media_type}/${media_id}`}
										>
											<p className="font-bold text-lg hover:underline line-clamp-3">
												{media.title || media.name}
											</p>
										</Link>
									)}
								</div> */}
								{/* {media && (
									<div className="flex flex-row items-center gap-1">
										<div className="pt-2">
											<p className="text-xs">
												User rating:
											</p>
											<p className="text-5xl font-bold text-foreground">
												{post.vote_user?.toFixed(0)}
												<span className="text-xs text-foreground">
													/10
												</span>
											</p>
										</div>
										<div>
											<p className="text-xs">
												Avg rating:
											</p>
											<p className="text-xl font-bold">
												{media.vote_average?.toFixed(1)}{" "}
												<span className="text-xs">
													/10
												</span>
											</p>
										</div>
									</div>
								)} */}
							</div>
						</div>
					</div>
				</div>
				<div className=" px-4 pb-2">
					<UserReviewText
						post_review={post.review_user || "no review"}
						creator_name={creator?.user.username || "no user"}
					></UserReviewText>
				</div>
				<div className="relative">
					<ViewComments postId={post.id}></ViewComments>
				</div>
				<div className="w-full h-[50px] px-4 border-t border-foreground/30">
					<div className="flex flex-row gap-4 align-center w-full h-full justify-between ">
						<div className="flex flex-row items-center gap-4">
							<LikeButton postId={post.id}></LikeButton>
							<p className="font-bold text-xl text-foreground/50">
								<PostLikedNumber
									postId={post.id}
								></PostLikedNumber>{" "}
								<span className=" font-base text-base">
									likes
								</span>
							</p>
						</div>
						<SaveButton postId={post.id}></SaveButton>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomePostCard;
