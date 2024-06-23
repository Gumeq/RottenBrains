import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Bottombar = () => {
	return (
		<div className="fixed bottom-0">
			<ul className="bottom-bar flex flex-row gap-6">
				{sidebarLinks.map((link: INavLink) => {
					return (
						<Link
							href={link.route}
							className="flex gap-4 items-center p-4"
						>
							<Image
								src={link.imgURL}
								alt={""}
								width={30}
								height={30}
								className="invert-on-dark"
							/>
						</Link>
					);
				})}
			</ul>
		</div>
	);
};

export default Bottombar;
