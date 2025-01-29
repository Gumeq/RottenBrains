import HomeMediaCardSkeleton from "@/components/HomeMediaCardSkeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 pr-8">
      {Array.from({ length: 24 }).map((_, index) => (
        <HomeMediaCardSkeleton></HomeMediaCardSkeleton>
      ))}
    </div>
  );
};

export default loading;
