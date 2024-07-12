"use client";

import { useEffect, useState } from "react";
import AddComment from "./AddComment";
import { getPostComments } from "@/utils/supabase/queries";
import CommentCard from "./CommentCard";

interface ViewCommentsProps {
	postId: string;
}

const ViewComments: React.FC<ViewCommentsProps> = ({ postId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [comments, setComments] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchComments = async () => {
			const comments = await getPostComments(postId);
			setComments(comments);
			setLoading(false);
		};

		fetchComments();
	}, [postId]);

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative">
			<button
				onClick={togglePopup}
				className="text-foreground opacity-50 px-4 py-2 rounded-md"
			>
				<img
					src="/assets/icons/comment-regular.svg"
					alt=""
					width={30}
					height={30}
					className="invert-on-dark"
				/>
			</button>
			{isOpen && (
				<div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50 ">
					<div className="relative bg-background p-4 rounded-lg shadow-lg w-screen md:max-w-4xl h-4/5 md:h-auto md:max-h-[80%]">
						<button
							onClick={togglePopup}
							className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md"
						>
							Close
						</button>
						<div className="flex flex-col overflow-y-auto h-3/4">
							{loading ? (
								<div className="flex justify-center items-center h-full">
									<span>Loading...</span>
								</div>
							) : comments.length === 0 ? (
								<div className="flex justify-center items-center h-full">
									<span>No comments yet</span>
								</div>
							) : (
								<div className="w-full">
									{comments.map((comment) => (
										<div
											key={comment.id}
											className="w-full"
										>
											<CommentCard comment={comment} />
										</div>
									))}
								</div>
							)}
						</div>
						<div className="absolute w-11/12 bottom-6 ">
							<AddComment postId={postId} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewComments;
