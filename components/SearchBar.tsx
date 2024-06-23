import React from "react";
import { useState } from "react";
import SearchMovies from "./SearchMovies";

// SEARCH BAR!
const SearchBar = ({ media, setMedia }: any) => {
	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};
	return (
		<form action="" className="" onSubmit={handleSearch}>
			<div className="max-w-[500px] ">
				<SearchMovies media={media} setMedia={setMedia}></SearchMovies>
			</div>
		</form>
	);
};

export default SearchBar;
