import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import movieGenres from "@/lib/constants/movie_genres.json";
import tvGenres from "@/lib/constants/tv_genres.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(inputDate: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function getOrdinalSuffix(day: any) {
    if (day > 3 && day < 21) return "th"; // Covers 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  if (inputDate === null || inputDate === undefined) {
    return;
  }
  // Parse the input date string
  const dateParts = inputDate.split("-");
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1], 10) - 1];
  const day = parseInt(dateParts[2], 10);
  const ordinalSuffix = getOrdinalSuffix(day);

  // Format the date
  return `${day}${ordinalSuffix} ${month} ${year}`;
}

export function transformRuntime(minutes: number): string {
  const hours: number = Math.floor(minutes / 60);
  const remainingMinutes: number = minutes % 60;
  const seconds: number = Math.floor(Math.random() * 60); // Random seconds between 0 and 59

  const formattedMinutes: string = remainingMinutes.toString().padStart(2, "0");
  const formattedSeconds: string = seconds.toString().padStart(2, "0");

  // Conditionally include hours only if it's greater than 0
  if (hours > 0) {
    const formattedHours: string = hours.toString();
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

export function getRelativeTime(dateString: string): string {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = inputDate.getTime() - currentDate.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(Math.abs(diffDays) / 7);
  const diffMonths = Math.floor(Math.abs(diffDays) / 30);
  const diffYears = Math.floor(Math.abs(diffDays) / 365);

  if (diffDays < 0) {
    // Handle past dates
    if (diffYears >= 1) {
      return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    } else if (diffMonths >= 1) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } else if (diffWeeks >= 1) {
      return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    } else if (diffDays === -1) {
      return "yesterday";
    } else {
      return `${Math.abs(diffDays)} day${
        Math.abs(diffDays) > 1 ? "s" : ""
      } ago`;
    }
  } else if (diffDays > 0) {
    // Handle future dates
    if (diffYears >= 1) {
      return `in ${diffYears} year${diffYears > 1 ? "s" : ""}`;
    } else if (diffMonths >= 1) {
      return `in ${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    } else if (diffWeeks >= 1) {
      return `in ${diffWeeks} week${diffWeeks > 1 ? "s" : ""}`;
    } else if (diffDays === 1) {
      return "tomorrow";
    } else {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  } else {
    // Handle today's date
    return "today";
  }
}

export const formatEpisodeCode = (
  seasonNumber: number,
  episodeNumber: number,
) => {
  return `S${String(seasonNumber).padStart(2, "0")}E${String(
    episodeNumber,
  ).padStart(2, "0")}`;
};

type Genre = {
  id: number;
  name: string;
};

export function getGenreNameById(genreId: number): string {
  // Combine genres into one array
  const combinedGenres: Genre[] = [...movieGenres.genres, ...tvGenres.genres];

  // Verify the genreId type
  if (typeof genreId !== "number") {
    throw new Error(
      `Invalid genreId type: ${typeof genreId}. Expected a number.`,
    );
  }

  // Find the genre by ID
  const genre = combinedGenres.find((g) => {
    return g.id === genreId;
  });

  // Handle missing genre
  if (!genre) {
    throw new Error(`Genre with ID ${genreId} not found.`);
  }

  // Return the genre name
  return genre.name;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
