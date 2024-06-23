"use client";

import { IMedia, IPost } from "@/types";
import React, { useState } from "react";
import SearchBar from "../SearchBar";
import Image from "next/image";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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
		review_user: "Λοιπον είδα το " + (media?.title || media?.name || ""),
		vote_user: 0,
	});

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
		console.log("done");
		router.push("/protected/home");
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-10 flex flex-col text-foreground">
			<div className="py-4 self-center md:w-[500px] w-[300px]">
				<p className="py-2">Search for Movie or TV</p>
				<SearchBar media={media} setMedia={setMedia}></SearchBar>
			</div>
			<div className="flex flex-col md:flex-row">
				<div className="w-[300px] h-[450px] bg-foreground/10 rounded-xl m-auto overflow-hidden">
					{media?.poster_path && (
						<Image
							src={`https://image.tmdb.org/t/p/w500${media?.poster_path}`}
							alt={""}
							width={300}
							height={450}
						></Image>
					)}
				</div>
				<div className="md:w-1/2 px-4 w-full">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						{/* Description */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-medium mb-1">
								Review
							</label>
							<textarea
								name="review_user"
								value={formValues.review_user}
								onChange={handleInputChange}
								placeholder="Enter value for field 3"
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background h-40"
								maxLength={200}
							/>
						</div>
						{/* Rating */}
						<div className="flex flex-col">
							<label className="text-gray-700 font-medium mb-1">
								Rating
							</label>
							<input
								type="number"
								name="vote_user"
								value={formValues.vote_user}
								onChange={handleInputChange}
								placeholder="6/9"
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background "
								max={10}
								min={0}
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="bg-accent/90 text-white font-bold py-2 rounded mt-4 hover:bg-accent"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
			<div className="h-[200px]"></div>
		</div>
	);
};

export default PostForm;
