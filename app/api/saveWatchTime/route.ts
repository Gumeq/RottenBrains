// app/api/saveWatchTime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upsertWatchHistory } from "@/utils/supabase/queries";

interface WatchTimeData {
	time_spent: number;
	percentage_watched: string;
	user_id: string;
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
}

export async function POST(req: NextRequest) {
	try {
		const data: WatchTimeData = await req.json();
		console.log("Received data on server:", data);

		// Call the upsert function with appropriate handling for optional fields
		const result = await upsertWatchHistory(
			data.user_id,
			data.media_type,
			data.media_id,
			data.time_spent,
			data.percentage_watched,
			data.season_number ?? null, // Pass null if season_number is undefined
			data.episode_number ?? null // Pass null if episode_number is undefined
		);

		return NextResponse.json({
			message: "Watch time saved successfully",
			result,
		});
	} catch (error) {
		console.error("Error saving watch time:", error);
		return NextResponse.json(
			{ message: "Error saving watch time", error: error },
			{ status: 500 }
		);
	}
}
