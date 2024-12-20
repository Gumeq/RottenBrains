import { getWatchHistoryForUser } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import HomeMediaCard from "../home/HomeMediaCard";

// Define the type for a single watch history item
interface WatchHistoryItem {
  id: string; // Assuming there's an 'id' field
  media_id: string;
  created_at: string | Date; // Date or string timestamp
  title?: string; // Add other optional fields based on your data structure
}

const page = async () => {
  // Fetch the user and watch history
  const user = await getCurrentUser();
  const limit = 20;
  const offset = 0;

  // Type the result of the watch history call
  const watchHistory: WatchHistoryItem[] = await getWatchHistoryForUser(
    user.user?.id as string,
    limit,
    offset,
  );

  const user_id = user.user.id.toString();

  // Group watch history by date
  const groupedByDate: Record<string, WatchHistoryItem[]> = watchHistory.reduce(
    (acc: Record<string, WatchHistoryItem[]>, item) => {
      const watchedDate = new Date(item.created_at);
      const dateKey = format(watchedDate, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {},
  );

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Helper function to generate labels for dates
  const getDateLabel = (dateString: string): string => {
    const d = new Date(dateString);
    const formattedDate = format(d, "dd MMM yyyy"); // e.g., "15 Nov 2024"
    if (isToday(d)) return `Today - ${formattedDate}`;
    if (isYesterday(d)) return `Yesterday - ${formattedDate}`;
    return formattedDate; // For all other dates
  };

  return (
    <div className="my-4 mb-12 w-full px-4 lg:px-0">
      <h1 className="px-4 text-lg font-semibold">History</h1>
      <div className="my-4 w-full border-b-2 border-foreground/5"></div>

      {sortedDates.map((dateKey) => {
        const items = groupedByDate[dateKey];
        return (
          <div key={dateKey} className="flex flex-col">
            <div className="flex flex-row items-center gap-4 py-2">
              <div className="h-1 w-1 rounded-full bg-accent"></div>
              <h2 className="text-lg font-semibold">{getDateLabel(dateKey)}</h2>
            </div>
            <div className="flex flex-row flex-wrap gap-4 border-l-2 border-foreground/20 pb-4 pl-4">
              {items.map((media: any) => {
                media.season_number === -1
                  ? (media.season_number = null)
                  : media.season_number;
                media.episode_number === -1
                  ? (media.episode_number = null)
                  : media.episode_number;
                return (
                  <HomeMediaCard
                    key={media.id}
                    user_id={user_id}
                    media_type={media.media_type}
                    media_id={media.media_id}
                    season_number={media.season_number}
                    episode_number={media.episode_number}
                    rounded={true}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default page;
