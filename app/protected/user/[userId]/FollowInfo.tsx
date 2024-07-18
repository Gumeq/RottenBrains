"use client";
import { IUser } from "@/types";
import {
	getFollowers,
	getFollowing,
	getPostCount,
} from "@/utils/supabase/queries";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import UserCard from "./UserCard";

const FollowInfo = ({ user }: any) => {
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [followersCount, setFollowersCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);
	const [postCount, setPostCount] = useState(0);
	const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
	const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { followers, followers_count } = await getFollowers(
					user.id
				);
				setFollowers(followers);
				setFollowersCount(followers_count);

				const { following, following_count } = await getFollowing(
					user.id
				);
				setFollowing(following);
				setFollowingCount(following_count);

				const { post_count } = await getPostCount(user.id);
				setPostCount(post_count);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [user.id]);

	return (
		<div className="w-full h-full">
			<div className="flex flex-row items-center justify-center w-full h-full gap-8">
				<div className="flex flex-col items-center justify-center gap-2">
					<p className="text-2xl font-bold">{postCount}</p>
					<p>posts</p>
				</div>
				<div
					className="flex flex-col items-center justify-center gap-2 cursor-pointer"
					onClick={() => setIsFollowersModalOpen(true)}
				>
					<p className="text-2xl font-bold">{followersCount}</p>
					<p>followers</p>
				</div>
				<div
					className="flex flex-col items-center justify-center gap-2 cursor-pointer"
					onClick={() => setIsFollowingModalOpen(true)}
				>
					<p className="text-2xl font-bold">{followingCount}</p>
					<p>following</p>
				</div>
			</div>

			<Modal
				isOpen={isFollowersModalOpen}
				onClose={() => setIsFollowersModalOpen(false)}
				title="Followers"
			>
				<ul className="flex flex-col gap-2">
					{followers.map((user: any) => (
						<li key={user.id}>
							<UserCard user={user.users}></UserCard>
						</li>
					))}
				</ul>
			</Modal>

			<Modal
				isOpen={isFollowingModalOpen}
				onClose={() => setIsFollowingModalOpen(false)}
				title="Following"
			>
				<ul className="flex flex-col gap-2">
					{following.map((user: any) => (
						<li key={user.id}>
							<UserCard user={user.users}></UserCard>
						</li>
					))}
				</ul>
			</Modal>
		</div>
	);
};

export default FollowInfo;
