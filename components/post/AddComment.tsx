"use client";
import { useUser } from "@/context/UserContext";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import { addNotification } from "@/utils/clientFunctions/notificationsData";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface CommentProps {
	postId: string;
}

const AddComment: React.FC<CommentProps> = ({ postId }) => {
	const [content, setContent] = useState("");

	const supabase = createClient();
	const { user } = useUser();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			alert("You must be logged in to comment");
			return;
		}

		const { data, error } = await supabase
			.from("comments")
			.insert([{ post_id: postId, user_id: user.id, content }]);

		if (error) {
			console.error(error);
		} else {
			setContent("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<textarea
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
