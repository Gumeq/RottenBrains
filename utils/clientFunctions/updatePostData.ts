"use client";

import { IPost, IUser } from "@/types";
import { createClient } from "../supabase/client";
import { useState } from "react";

type savePostToUserProps = {
	userId: string;
	postId: string;
};

const supabase = createClient();

export const savePost = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("saves")
		.insert([{ user_id: userId, post_id: postId }]);

	if (error) {
		console.error("Error saving post:", error.message);
	} else {
		console.log("Post saved:", data);
	}

	return { data, error };
};

export const removeSave = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("saves")
		.delete()
		.eq("user_id", userId)
		.eq("post_id", postId);

	if (error) {
		console.error("Error removing save:", error.message);
	} else {
		console.log("Save removed:");
	}

	return { data, error };
};

// Example implementation of getSavedStatus function
export const getSavedStatus = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("saves")
		.select("id")
		.eq("user_id", userId)
		.eq("post_id", postId)
		.single();

	if (error) {
		console.error("Error fetching saved status:", error.message);
		return false;
	}

	return data !== null; // Return true if there's a record (post is saved), false otherwise
};

export const likePost = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("likes")
		.insert([{ user_id: userId, post_id: postId }]);

	if (error) {
		console.error("Error saving post:", error.message);
	} else {
		console.log("Post saved:", data);
	}

	const { error: postError } = await supabase.rpc("increment_likes", {
		post_id: postId,
	});

	if (postError) {
		console.log("Error adding likes");
	}

	return { data, error };
};

export const removeLike = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("likes")
		.delete()
		.eq("user_id", userId)
		.eq("post_id", postId);

	if (error) {
		console.error("Error removing save:", error.message);
	} else {
		console.log("Save removed:");
	}

	const { error: postError } = await supabase.rpc("decrement_likes", {
		post_id: postId,
	});

	if (postError) {
		console.log("Error adding likes");
	}

	return { data, error };
};

// Example implementation of getSavedStatus function
export const getLikedStatus = async (userId: string, postId: string) => {
	const { data, error } = await supabase
		.from("likes")
		.select("id")
		.eq("user_id", userId)
		.eq("post_id", postId)
		.single();

	if (error) {
		console.error("Error fetching saved status:", error.message);
		return false;
	}

	return data !== null; // Return true if there's a record (post is saved), false otherwise
};
