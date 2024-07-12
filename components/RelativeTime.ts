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
			return "over a year ago";
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
			return `in over a year`;
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
