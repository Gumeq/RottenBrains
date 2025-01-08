import React from "react";
import BlogNav from "./BlogNav";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full"> </div>
      <div className="w-full overflow-x-hidden bg-background text-foreground md:flex">
        <div className="hidden lg:flex">
          <BlogNav>{children}</BlogNav>
        </div>
      </div>
    </div>
  );
}
