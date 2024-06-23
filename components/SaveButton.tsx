"use client";

import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getSavedStatus,
	removeSave,
	savePost,
} from "@/utils/clientFunctions/updatePostData";
import Image from "next/image";
// SaveButton.tsx
import { useEffect, useState } from "react";

interface SaveButtonProps {
	postId: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ postId }) => {
	const [saved, setSaved] = useState(false);

	const user = fetchUserData();
	let userId: string;
	if (user) {
		userId = user.id;
	}

	const handleSave = async () => {
		if (user) {
			try {
				if (saved) {
					await removeSave(userId!, postId); // Assuming userId is defined when saved is true
				} else {
					await savePost(userId!, postId); // Assuming userId is defined when saved is false
				}
				setSaved(!saved); // Toggle saved state
			} catch (error) {
				console.error("Error saving or removing save:", error);
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				const isPostSaved = await getSavedStatus(user.id, postId); // Assuming getSavedStatus is asynchronous
				setSaved(isPostSaved);
			}
		};

		fetchData();
	}, [postId, handleSave]);

	if (userId! === null) {
		return null; // Return null or a loading indicator until user data is fetched
	}

	return (
		<button onClick={handleSave}>
			{saved ? (
				<Image
					src={"/assets/icons/bookmark-solid.svg"}
					alt=""
					width={20}
					height={20}
					className="invert-on-dark"
				></Image>
			) : (
				<Image
					src={"/assets/icons/bookmark-regular.svg"}
					alt=""
					width={20}
					height={20}
					className="invert-on-dark"
				></Image>
			)}
		</button>
	);
};

export default SaveButton;
