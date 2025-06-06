"use client";
import { useUser } from "@/hooks/UserContext";
import { uploadProfilePicture } from "@/lib/supabase/clientQueries";
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
      const success = await uploadProfilePicture(file, user?.id.toString());
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
    <div className="relative flex flex-col items-center">
      <img
        src={(newImage as string) || image}
        alt="Profile"
        className="overlay-hidden aspect-[1/1] w-[100px] min-w-[100px] rounded-full md:w-[150px] md:min-w-[150px]"
      />
      {isEditing ? (
        <div className="flex flex-col items-center">
          <input type="file" onChange={handleFileChange} />
          <div className="mt-2 flex gap-4">
            <button
              onClick={handleSave}
              className="rounded bg-accent px-4 py-2 text-white"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="rounded bg-foreground/10 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute flex h-full w-full items-center justify-center rounded px-4 py-2 text-white opacity-0 hover:opacity-100"
        >
          <img
            src="/assets/icons/pen-to-square-solid.svg"
            alt="Edit"
            className="invert-on-dark h-[50px] w-[50px]"
          />
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;
