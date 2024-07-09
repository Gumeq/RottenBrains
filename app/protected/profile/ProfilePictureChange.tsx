"use client";
import { uploadProfilePicture } from "@/utils/supabase/queries";
import React, { useState } from "react";
// import { uploadProfilePicture } from "@/utils/supabase/queries"; // You need to implement this function

const ProfilePicture = ({ user }: any) => {
	const [image, setImage] = useState(user.user.imageURL);
	const [isEditing, setIsEditing] = useState(false);
	const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (e: any) => {
		const selectedFile = e.target.files[0];
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
			const success = await uploadProfilePicture(file);
			if (success) {
				setImage(newImage);
				setIsEditing(false);
				setNewImage(null);
				setFile(null); // Reset the file object
			} else {
				// Handle error
			}
		}
	};
	return (
		<div className="flex flex-col items-center relative">
			<img
				src={newImage || image}
				alt=""
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
					className=" text-white px-4 py-2 rounded absolute w-full h-full flex items-center justify-center opacity-0 hover:opacity-100"
				>
					<img
						src="/assets/icons/pen-to-square-solid.svg"
						alt=""
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
