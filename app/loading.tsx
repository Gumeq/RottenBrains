import HomeMediaCardSkeleton from "@/components/features/media/MediaCardSkeleton";
import React from "react";

const loading = () => {
	return (
		<div className="mt-14 grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 px-4 lg:mt-0 lg:gap-4 lg:px-0 lg:pr-8">
			{Array.from({ length: 24 }).map((_, index) => (
				<HomeMediaCardSkeleton></HomeMediaCardSkeleton>
			))}
		</div>
	);
};

export default loading;
