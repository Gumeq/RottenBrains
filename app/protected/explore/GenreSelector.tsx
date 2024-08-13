"use client";

import React, { useEffect, useRef, useState } from "react";
import movieGenres from "../../../constants/movie_genres.json";
import tvGenres from "../../../constants/tv_genres.json";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/Loader";
import { getFromGenres } from "@/utils/tmdb";
import { motion } from "framer-motion";

const GenreSelector: React.FC = () => {
	const [selectedType, setSelectedType] = useState<"movie" | "tv">("movie");
	const [mediaGenre, setMediaGenre] = useState<any[]>([]);
	const [selectedGenre, setSelectedGenre] = useState<string>("14");
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const { ref, inView } = useInView();

	const targetRef = useRef<HTMLDivElement>(null);

	const variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	useEffect(() => {
		const loadMore = async () => {
			if (inView && hasMore && !loading) {
				setLoading(true);
				try {
					const result = await getFromGenres(
						selectedType,
						page,
						selectedGenre
					);
					const res = result.results;
					if (res.length === 0) {
						setHasMore(false); // No more posts to load
					} else {
						setMediaGenre((prevMediaGenre: any) => [
							...prevMediaGenre,
							...res,
						]);
						setPage((prevPage) => prevPage + 1);
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		loadMore();
	}, [inView, hasMore, loading, page, selectedType, selectedGenre]);

	const handleButtonClick = (type: "movie" | "tv") => {
		setSelectedType(type);
	};

	const handleGenreClick = (genre_id: string) => {
		setMediaGenre([]);
		setSelectedGenre(genre_id);
	};

	const handleScrollToTarget = () => {
		targetRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const genres =
		selectedType === "movie" ? movieGenres.genres : tvGenres.genres;
	// Add selectedType to dependencies to fetch when type changes

	return (
		<div
			className="w-full flex justify-center flex-col gap-4 p-2"
			ref={targetRef}
		>
			{/* <button
				onClick={handleScrollToTarget}
				className="fixed bottom-[25px] right-[25px] bg-accent p-8 rounded-full min-h-10 min-w-10 hidden md:block"
			></button> */}
			<div className="flex flex-row gap-4 justify-center mt-4">
				<button
					key={"movie"}
					onClick={() => handleButtonClick("movie")}
					className={`text-xl p-2 px-6 rounded-[8px] hover:bg-accent/30 ${
						selectedType === "movie"
							? "bg-accent/30"
							: "bg-foreground/10"
					}`}
				>
					Movie Genres
				</button>
				<button
					key={"tv"}
					onClick={() => handleButtonClick("tv")}
					className={`text-xl p-2 px-6 rounded-[8px] hover:bg-accent/30 ${
						selectedType === "tv"
							? "bg-accent/30"
							: "bg-foreground/10"
					}`}
				>
					TV Genres
				</button>
			</div>
			<div className="flex justify-center mb-4">
				<ul className="flex flex-row gap-4 items-center overflow-x-auto custom-scrollbar pb-2">
					{genres.map((genre) => (
						<li key={genre.id} className="flex-shrink-0">
							<button
								key={genre.id}
								className={`p-2 px-6 rounded-[8px] hover:bg-accent/30  ${
									genre.id.toString() === selectedGenre
										? "bg-accent/30"
										: "bg-foreground/10"
								}`}
								onClick={() =>
									handleGenreClick(genre.id.toString())
								}
							>
								{genre.name}
							</button>
						</li>
					))}
				</ul>
			</div>
			<div className="w-full mx-auto grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
				{mediaGenre && mediaGenre.length > 0 ? (
					mediaGenre.map((media: any) => (
						<Link
							href={`/protected/media/${selectedType}/${media.id}`}
						>
							<motion.div
								key={media.id}
								variants={variants}
								initial="hidden"
								animate="visible"
								transition={{
									delay: 0.15,
									ease: "easeInOut",
									duration: 0.25,
								}}
								viewport={{ amount: 0 }}
							>
								<img
									src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
									alt={media.title || media.name}
									className="rounded-[8px] hover:opacity-80 bg-foreground/5 "
									loading="lazy"
								/>
							</motion.div>
						</Link>
					))
				) : (
					<p>Select a Genre</p>
				)}
			</div>
			{loading && <Loader></Loader>}
			{!loading && hasMore && <div ref={ref}></div>}
		</div>
	);
};

export default GenreSelector;
