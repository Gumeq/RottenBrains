"use client";

import { IMedia, IPost } from "@/types";
import React, { useEffect, useState } from "react";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchBar from "../searchBar/SearchBar";

type PostFormProps = {
	post?: IPost;
	action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const [media, setMedia] = useState<IMedia | null>(null);

	const user = fetchUserData();
	const router = useRouter();

	// State to manage input values
	const [formValues, setFormValues] = useState({
		review_user: "Λοιπον είδα το ",
		vote_user: 0,
	});

	// Use useEffect to update the review_user when media changes
	useEffect(() => {
		if (action === "Update" && post) {
			setFormValues((prevValues) => ({
				...prevValues,
				review_user: post.review_user,
				vote_user: post.vote_user,
			}));
		} else {
			if (media) {
				setFormValues((prevValues) => ({
					...prevValues,
					review_user: `Λοιπον είδα το ${media.title || media.name},`,
				}));
			}
		}
	}, [media]);

	// Handle input change
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const dbvalues = {
			...formValues,
			mediaId: media?.id,
			creatorId: user?.id,
			media_type: media?.media_type,
		};
		console.log("Form submitted:", dbvalues);

		const supabase = createClient();

		if (post && action === "Update") {
			try {
				// Insert a new row into the 'posts' table
				const { data, error } = await supabase
					.from("posts")
					.update([
						{
							mediaid: dbvalues.mediaId,
							media_type: dbvalues.media_type,
							creatorid: dbvalues.creatorId,
							vote_user: dbvalues.vote_user,
							review_user: dbvalues.review_user,
						},
					])
					.eq("id", post.id)
					.select();

				if (error) {
					throw error;
				}
			} catch (error) {
				console.error("Error inserting data:", error);
			}
		} else {
			try {
				// Insert a new row into the 'posts' table
				const { data, error } = await supabase
					.from("posts")
					.insert([
						{
							mediaid: dbvalues.mediaId,
							media_type: dbvalues.media_type,
							creatorid: dbvalues.creatorId,
							vote_user: dbvalues.vote_user,
							review_user: dbvalues.review_user,
						},
					])
					.select();

				if (error) {
					throw error;
				}
			} catch (error) {
				console.error("Error inserting data:", error);
			}
		}
		console.log("done");
		router.push("/protected/home");
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-10 flex flex-col text-foreground">
			<div className="py-4 self-center md:w-[500px] w-[300px]">
				<p className="py-2 text-lg font-semibold text-center">
					Search for a Movie or TV Show
				</p>
				<SearchBar media={media} setMedia={setMedia}></SearchBar>
			</div>
			<div className="flex flex-col md:flex-row items-center">
				<div className="w-[300px] h-[450px] bg-foreground/10 rounded-xl m-auto overflow-hidden shadow-lg">
					{media?.poster_path && (
						<img
							src={`https://image.tmdb.org/t/p/w500${media?.poster_path}`}
							alt="Poster"
							width="300"
							height="450"
							className="object-cover"
						/>
					)}
				</div>
				<div className="md:w-1/2 px-4 w-full mt-6 md:mt-0">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-6 bg-background p-6 rounded-lg shadow-md"
					>
						{/* Description */}
						<div className="flex flex-col">
							<label className="text-foreground/30 font-medium mb-2">
								Review
							</label>
							<textarea
								name="review_user"
								value={formValues.review_user}
								onChange={handleInputChange}
								placeholder="Write your review here..."
								className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent text-foreground bg-background h-40 resize-none"
								maxLength={200}
							/>
						</div>
						{/* Rating */}
						<div className="flex flex-col">
							<label className="text-foreground/30 font-medium mb-2">
								Rating
							</label>
							<input
								type="number"
								name="vote_user"
								value={formValues.vote_user}
								onChange={handleInputChange}
								placeholder="Rate from 0 to 10"
								className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent text-foreground bg-background"
								max={10}
								min={0}
								step={0.1} // Allows decimal values
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="bg-accent/90 text-foreground font-bold py-3 rounded hover:bg-accent transition duration-300"
						>
							{action}
						</button>
					</form>
				</div>
			</div>
			<div className="h-[200px]"></div>
		</div>
	);
};

export default PostForm;
