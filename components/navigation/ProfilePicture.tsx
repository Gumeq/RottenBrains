"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import ThemeSwitch from "../ThemSwitch";
import Link from "next/link";

const ProfilePicture = () => {
	const { user } = useUser();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleToggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative inline-block">
			<img
				src={user?.image_url}
				alt="User Avatar"
				className="h-12 rounded-full aspect-[1/1] mr-1 cursor-pointer"
				onClick={handleToggleDropdown}
			/>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute right-0 mt-2 w-[250px] bg-background rounded-md shadow-lg z-10 border border-foreground/10"
				>
					<div className="py-2">
						<Link
							href="/protected/profile"
							className="px-4 py-2 hover:bg-accent/20 flex flex-row justify-between"
						>
							<p>Profile</p>
							<img
								src="/assets/icons/person-outline.svg"
								alt=""
								className="invert-on-dark"
							/>
						</Link>
						<Link
							href="/protected/settings"
							className="px-4 py-2 hover:bg-accent/20 flex flex-row justify-between"
						>
							<p>Settings</p>
							<img
								src="/assets/icons/settings-outline.svg"
								alt=""
								className="invert-on-dark"
							/>
						</Link>
						<div className="flex items-center w-full px-4 py-2 hover:bg-accent/20 ">
							<ThemeSwitch></ThemeSwitch>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePicture;
