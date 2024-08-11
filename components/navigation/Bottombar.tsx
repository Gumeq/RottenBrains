"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationButton from "../notifications/RealtimeNotifications";

const Bottombar = () => {
	const { user } = useUser();
	const pathname = usePathname();

	return (
		<div className="fixed bottom-0 z-50 flex items-center justify-center w-screen lg:hidden drop-shadow-xl">
			<ul className="w-full h-16 bg-background flex flex-row items-center justify-between drop-shadow-xl px-4 relative border-t border-foreground/20">
				<li>
					<Link
						href={"/protected/home"}
						className="flex items-center flex-col gap-1"
					>
						<img
							src="/assets/icons/home-outline.svg"
							alt="Home"
							width={25}
							height={25}
							className="invert-on-dark"
						></img>
						<p className="text-sm">Home</p>
					</Link>
				</li>
				<li>
					<Link
						href={"/protected/explore"}
						className="flex items-center flex-col gap-1"
					>
						<img
							src="/assets/icons/explore-outline.svg"
							alt="Explore"
							width={25}
							height={25}
							className="invert-on-dark"
						></img>
						<p className="text-sm">Explore</p>
					</Link>
				</li>
				<Link
					className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background flex items-center shadow_plus justify-center"
					href={"/protected/create-post"}
				>
					<img
						src="/assets/icons/plus.svg"
						alt="Create Post"
						className="invert-on-dark w-10 h-10"
					/>
				</Link>

				<li className="h-full w-[50px]"></li>

				<li className="flex flex-col gap-1 items-center rounded-full">
					<NotificationButton />
					<p className="text-sm">Notifs</p>
				</li>
				<li>
					<Link
						href={"/protected/profile"}
						className="flex items-center min-w-[45px] min-h-[45px] flex-col gap-1"
					>
						<img
							src={user?.image_url}
							alt="You"
							width={25}
							height={25}
							className="rounded-full overflow-hidden border border-foreground/30 drop-shadow-xl"
						></img>
						<p className="text-sm">You</p>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Bottombar;
