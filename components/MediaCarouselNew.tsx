"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import MediaCardExploreMain from "./MediaCardExploreMain";

const LazyImage = ({ src, alt, className, ...props }: any) => {
	const [loaded, setLoaded] = useState(false);

	const handleLoad = () => {
		setLoaded(true);
	};

	return (
		<img
			src={src}
			alt={alt}
			className={`${className} ${loaded ? "loaded" : "loading"}`}
			onLoad={handleLoad}
			{...props}
		/>
	);
};

function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
	}
	return num.toString();
}

const TopMoviesCarouselNew = ({ movies }: any) => {
	const settings = {
		dots: false,
		infinite: true,
		fade: true,
		waitForAnimate: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 7000, // Increased to reduce frequency of re-renders
		pauseOnHover: false,
	};

	const memoizedMediaCards = useCallback(
		(index: any, color: any) => (
			<div className="flex flex-col justify-between gap-2">
				<div className="w-full h-1/4 ">
					<MediaCardExploreMain
						media={movies[index + 1] || movies[0]}
						color={color}
					/>
				</div>
				<div className="w-full h-1/4 ">
					<MediaCardExploreMain
						media={movies[index + 2] || movies[1]}
						color={color}
					/>
				</div>
				<div className="w-full h-1/4 ">
					<MediaCardExploreMain
						media={movies[index + 3] || movies[2]}
						color={color}
					/>
				</div>
			</div>
		),
		[movies]
	);

	return (
		<div className="w-screen lg:h-auto h-[50vh] text-foreground lg:mt-16">
			<Slider {...settings}>
				{movies &&
					movies.slice(0, 5).map((media: any, index: number) => {
						const watchLink =
							media.media_type === "movie"
								? `/protected/watch/${media.media_type}/${media.id}`
								: `/protected/watch/${media.media_type}/${media.id}/1/1`;
						return (
							<div
								className="w-full md:h-[90vh] h-[50vh]"
								key={index}
							>
								<div className="w-full h-full relative">
									<div className="absolute top-0 right-0 w-full h-full z-20">
										<div className="w-full h-[40%]"></div>
										<div className="w-full h-[60%] ">
											<div className="w-[90%] h-full  mx-auto flex flex-col gap-8">
												<div className="lg:w-1/2 h-full flex flex-col lg:gap-16 gap-4">
													<div>
														<h1 className="lg:text-7xl text-2xl text-foreground/80  lg:py-4 lg:pb-8 pb-2 truncate">
															{media.title ||
																media.name}
														</h1>
														<h2 className="lg:text-3xl text-lg text-foreground/50 line-clamp-2">
															{media.overview}
														</h2>
													</div>
													<Link
														className="flex"
														href={watchLink}
													>
														<div className="lg:px-8 lg:py-4 px-4 py-2 bg-foreground lg:text-4xl text-lg rounded-full text-background font-medium hover:bg-transparent transition ease-in-out hover:text-foreground border-4 border-transparent hover:border-foreground">
															Watch Now
														</div>
													</Link>
												</div>
												<div className="lg:flex flex-row justify-between lg:w-full gap-8 p-2 hidden">
													{movies
														.slice(
															index + 1,
															index + 6
														)
														.map((movie: any) => {
															return (
																<Link
																	className="relative hover:scale-110 transition ease-in-out rounded-[16px] border-4 border-foreground/0 hover:border-white/80 overflow-hidden drop-shadow-lg"
																	href={"/"}
																>
																	<img
																		src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
																		alt=""
																		className="w-full aspect-[16/9]"
																	/>
																	<div className="absolute w-full h-full top-0 left-0 z-10 bg-black/30"></div>
																	<div className="absolute bottom-0 z-20 flex flex-col gap-2 px-4 py-2 text-white">
																		<p className="text-3xl line-clamp-1">
																			{movie.title ||
																				movie.name}
																		</p>
																		<p className="line-clamp-2 text-white/80">
																			{
																				movie.overview
																			}
																		</p>
																	</div>
																</Link>
															);
														})}
												</div>
											</div>
										</div>
									</div>
									<div className="w-full h-full absolute top-0 right-0 z-10 gradient-explore"></div>
									<img
										src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
										alt=""
										className="lg:w-full h-full object-cover"
									/>
								</div>
							</div>
						);
					})}
			</Slider>
		</div>
	);
};

export default React.memo(TopMoviesCarouselNew);
