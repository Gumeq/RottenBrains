"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { addNotification } from "@/utils/clientFunctions/notificationsData";

const AddComment: React.FC<any> = ({ post, user, fetchComments }) => {
	const [content, setContent] = useState("");
	const postId = post.post_id;

	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			alert("You must be logged in to comment");
			return;
		}

		const { data, error } = await supabase
			.from("comments")
			.insert([{ post_id: postId, user_id: user.id, content }])
			.select();

		const { error: incrementError } = await supabase.rpc(
			"increment_comments",
			{ post_id: postId }
		);
		if (incrementError) throw incrementError;
		if (data && data.length > 0) {
			await addNotification(
				user.id,
				post.creatorid,
				"comment",
				post.post_id,
				data[0].id
			);
		}

		if (error) {
			console.error(error);
		} else {
			setContent("");
			await fetchComments(); // Fetch comments after adding a new comment
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<input
				type="text"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				required
				className="w-full p-2 bg-foreground/30 rounded-xl mb-2 appearance-none focus:outline-none focus:ring-2 focus:ring-accent"
				placeholder="Add your comment..."
			/>
			<button
				type="submit"
				className="w-full bg-accent text-white py-2 rounded-md"
			>
				Add Comment
			</button>
		</form>
	);
};

export default AddComment;
