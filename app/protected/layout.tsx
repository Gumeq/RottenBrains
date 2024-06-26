import Bottombar from "@/components/navigation/Bottombar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import MobileTopNav from "@/components/navigation/MobileTopNav";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}
	return (
		<div>
			<div className="w-full h-[150px] "> </div>
			<div className="bg-background text-foreground w-full md:flex overflow-x-hidden">
				<LeftSidebar />
				<MobileTopNav></MobileTopNav>
				<div className="flex flex-1 ">{children}</div>
				<Bottombar />
			</div>
			<div className="w-full h-[200px] "> </div>
		</div>
	);
}
