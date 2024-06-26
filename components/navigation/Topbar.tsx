import React from "react";
import AuthButton from "../auth/AuthButton";

const Topbar = () => {
	return (
		<div className="topbar">
			<div className="flex-between py-4 px-5">
				<div>Logo</div>
				<AuthButton></AuthButton>
			</div>
		</div>
	);
};

export default Topbar;
