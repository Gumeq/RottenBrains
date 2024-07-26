"use client";
import { useUser } from "@/context/UserContext";
import { uploadProfilePicture } from "@/utils/supabase/queries";
import React, { useState, useEffect, ChangeEvent } from "react";

const ProfilePicture: React.FC = () => {
	const { user } = useUser();
	const [image, setImage] = useState<string>("");
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		if (user?.image_url) {
			setImage(user.image_url);
		}
	}, [user]);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			const reader = new FileReader();
			reader.onload = () => {
				setNewImage(reader.result);
				setFile(selectedFile); // Save the file object
			};
			reader.readAsDataURL(selectedFile);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setNewImage(null);
		setFile(null); // Reset the file object
	};

	const handleSave = async () => {
		if (file) {
			const success = await uploadProfilePicture(
				file,
				user?.id.toString()
			);
			if (success) {
				setImage(newImage as string);
				setIsEditing(false);
				setNewImage(null);
				setFile(null); // Reset the file object
			} else {
				// Handle error
				console.error("Error uploading profile picture");
			}
		}
	};

	if (!user) {
		return null; // Optionally, you can render a loading indicator or a message here
	}

	return (
		<div className="flex flex-col items-center relative">
			<img
				src={(newImage as string) || image}
				alt="Profile"
				width={150}
				height={150}
				className="rounded-full max-w-[150px] max-h-[150px] overlay-hidden"
			/>
			{isEditing ? (
				<div className="flex flex-col items-center">
					<input type="file" onChange={handleFileChange} />
					<div className="flex gap-4 mt-2">
						<button
							onClick={handleSave}
							className="bg-accent text-white px-4 py-2 rounded"
						>
							Save
						</button>
						<button
							onClick={handleCancel}
							className="bg-foreground/5 text-white px-4 py-2 rounded"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setIsEditing(true)}
					className="text-white px-4 py-2 rounded absolute w-full h-full flex items-center justify-center opacity-0 hover:opacity-100"
				>
					<img
						src="/assets/icons/pen-to-square-solid.svg"
						alt="Edit"
						width={50}
						height={50}
						className="invert-on-dark"
					/>
				</button>
			)}
		</div>
	);
};

export default ProfilePicture;
