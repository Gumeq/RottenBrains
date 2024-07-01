import { fetchUserDataServer } from "@/utils/serverFunctions/fetchUserData";

export const sidebarLinks = [
	{
		imgURL: "/assets/icons/house-solid.svg",
		route: "/protected/home",
		label: "Home",
	},
	{
		imgURL: "/assets/icons/magnifying-glass-solid.svg",
		route: "/protected/explore",
		label: "Explore",
	},
	{
		imgURL: "/assets/icons/square-plus-solid.svg",
		route: "/protected/create-post",
		label: "Add Post",
	},
];
