import AuthButton from "@/components/AuthButton";
import Bottombar from "@/components/Bottombar";
import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

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
			<div className="bg-background text-foreground w-full md:flex overflow-x-hidden">
				<LeftSidebar />
				<div className="flex flex-1 ">{children}</div>
				<Bottombar />
			</div>
			<div className="w-full h-[200px] "> </div>
		</div>
	);
}
