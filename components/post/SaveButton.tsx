"use client";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getSavedStatus,
	removeSave,
	savePost,
} from "@/utils/clientFunctions/updatePostData";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface SaveButtonProps {
	postId: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ postId }) => {
	const [saved, setSaved] = useState(false);
	const user = fetchUserData();
	const userId = user?.id;

	const handleSave = useCallback(async () => {
		if (userId) {
			setSaved((prevSaved) => !prevSaved); // Optimistic update
			try {
				if (saved) {
					await removeSave(userId, postId);
				} else {
					await savePost(userId, postId);
				}
			} catch (error) {
				setSaved((prevSaved) => !prevSaved); // Revert if there's an error
				console.error("Error saving or removing save:", error);
			}
		}
	}, [userId, postId, saved]);

	useEffect(() => {
		if (userId) {
			const fetchData = async () => {
				const isPostSaved = await getSavedStatus(userId, postId);
				setSaved(isPostSaved);
			};
			fetchData();
		}
	}, [userId, postId]);

	if (!userId) {
		return null; // Return null if user ID isn't available
	}

	return (
		<button onClick={handleSave}>
			{saved ? (
				<Image
					src={"/assets/icons/bookmark-solid.svg"}
					alt="Saved"
					width={20}
					height={20}
					className="invert-on-dark opacity-50"
				/>
			) : (
				<Image
					src={"/assets/icons/bookmark-regular.svg"}
					alt="Not Saved"
					width={20}
					height={20}
					className="invert-on-dark opacity-50"
				/>
			)}
		</button>
	);
};

export default SaveButton;
