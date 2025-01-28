import HomeMediaCardSkeleton from "@/components/HomeMediaCardSkeleton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 pr-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <HomeMediaCardSkeleton></HomeMediaCardSkeleton>
        ))}
      </div>
    </div>
  );
};

export default page;
