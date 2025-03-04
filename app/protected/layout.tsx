import { getCurrentUser } from "@/lib/supabase/serverQueries";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user?.premium) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-[16px] bg-foreground/10 text-center text-xl font-bold">
        This website no longer provides the content you want.
        <br />
        We will be shutting down operations shortly.
        <br />
        Please consider using another website.
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default layout;
