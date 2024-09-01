import React from "react";

import SearchBar from "../searchBar/SearchBar";
import NotificationButton from "../notifications/RealtimeNotifications";
import Link from "next/link";

const MobileTopNav = async () => {
  return (
    <div className="fixed top-0 z-30 flex w-screen items-center justify-center bg-background p-2 md:hidden">
      <div className="flex w-full flex-row items-center justify-between">
        <Link href={"/protected/home"}>
          <img
            src="/assets/images/logo-text.png"
            alt="text-logo"
            width={60}
            height={60}
            className="invert-on-dark"
          />
        </Link>
        {/* <div className=" h-full w-full mx-4">
					<SearchBar link={true}></SearchBar>
				</div> */}
        <NotificationButton></NotificationButton>
      </div>
    </div>
  );
};

export default MobileTopNav;
