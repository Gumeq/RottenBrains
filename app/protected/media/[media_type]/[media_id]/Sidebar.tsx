// components/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
	return (
		<div className="fixed right-0 top-[20vh] w-[15vw] text-white p-4 py-4 lg:flex items-center z-10 hidden">
			<div className="absolute bg-foreground/10 h-full w-2 rounded-md -ml-6 ">
				<div className="absolute top-0 w-full h-[10%] bg-accent rounded-md"></div>
			</div>
			<ul className="flex flex-col gap-4 ">
				<li>
					<a
						href="#overview"
						className="hover:text-accent cursor-pointer"
					>
						Overview
					</a>
				</li>
				<li>
					<a
						href="#videos"
						className="hover:text-accent cursor-pointer"
					>
						Videos
					</a>
				</li>
				<li>
					<a
						href="#photos"
						className="hover:text-accent cursor-pointer"
					>
						Photos
					</a>
				</li>
				<li>
					<a
						href="#cast"
						className="hover:text-accent cursor-pointer"
					>
						Cast & Crew
					</a>
				</li>
				<li>
					<a
						href="#reviews"
						className="hover:text-accent cursor-pointer"
					>
						User reviews
					</a>
				</li>
				<li>
					<a
						href="#news"
						className="hover:text-accent cursor-pointer"
					>
						News
					</a>
				</li>
				<li>
					<a
						href="#storyline"
						className="hover:text-accent cursor-pointer"
					>
						Storyline
					</a>
				</li>
				<li>
					<a
						href="#didyouknow"
						className="hover:text-accent cursor-pointer"
					>
						Did you know
					</a>
				</li>
				<li>
					<a
						href="#details"
						className="hover:text-accent cursor-pointer"
					>
						Details
					</a>
				</li>
				<li>
					<a
						href="#boxoffice"
						className="hover:text-accent cursor-pointer"
					>
						Box office
					</a>
				</li>
				<li>
					<a
						href="#techspecs"
						className="hover:text-accent cursor-pointer"
					>
						Technical specs
					</a>
				</li>
				<li>
					<a
						href="#morelikethis"
						className="hover:text-accent cursor-pointer"
					>
						More like this
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
