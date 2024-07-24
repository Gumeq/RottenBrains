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

const TopMoviesCarousel = ({ movies }: any) => {
	const settings = {
		dots: true,
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
			<>
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
			</>
		),
		[movies]
	);

	return (
		<div className="w-screen lg:h-screen h-auto ">
			<Slider {...settings}>
				{movies &&
					movies.map((media: any, index: number) => {
						const watchLink =
							media.media_type === "movie"
								? `/protected/watch/${media.media_type}/${media.id}`
								: `/protected/watch/${media.media_type}/${media.id}/1/1`;
						return (
							<div
								className="lg:h-screen h-full w-full lg:px-0"
								key={index}
							>
								<div
									className="w-full lg:h-full h-full flex items-center justify-center"
									style={{
										backgroundImage: `radial-gradient(circle, ${media.averageColor} 0%, black 100%)`,
									}}
								>
									<div className="flex lg:flex-row flex-col gap-8 h-full lg:w-[80vw] w-[100vw] lg:py-10">
										<div className="xl:w-[70%] lg:w-[90%] w-[100%] flex items-start ">
											<div className="relative w-full h-auto aspect-[3/2] flex flex-col">
												<div className="lg:h-[40%] h-[10%]"></div>
												<div className="lg:h-[60%] h-[100%] z-10 flex flex-row ">
													<Link
														href={`/protected/media/${media.media_type}/${media.id}`}
														className="rounded-[8px] drop-shadow-xl min-h-[100%] w-auto mx-4 aspect-[2/3]"
													>
														<LazyImage
															src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
															alt="Poster Image"
															className={
																"rounded-[8px]"
															}
														/>
													</Link>

													<div className="flex flex-col h-full w-full lg:justify-end">
														<div className=" xl:h-[30%] lg:h-[50%] h-full w-full flex lg:flex-row items-center gap-4 flex-col ">
															<Link
																href={watchLink}
																className="relative lg:h-full w-auto h-[50%] bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40"
																style={{
																	aspectRatio:
																		"1 / 1",
																}}
															>
																<img
																	src="/assets/icons/play-solid.svg"
																	alt=""
																	className="w-[40%] h-[40%] ml-[5%] invert"
																/>
															</Link>
															<div className="flex-col gap-2 flex text-center lg:text-left">
																<p className="lg:text-4xl md:text-2xl text-xl ">
																	{media.title ||
																		media.name}
																</p>
																<p className="md:text-2xl text-xl opacity-60 ">
																	Watch now
																</p>
															</div>
														</div>
													</div>
												</div>
												<div className="absolute top-0 ">
													<LazyImage
														src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
														alt="Background Image"
														className="lg:rounded-[16px] mask1 w-full h-full aspect-[3/2] object-cover opacity-80"
													/>
												</div>
											</div>
										</div>
										<div className=" lg:h-[60%] h-full lg:w-[30%] w-full flex flex-col lg:gap-8 gap-4 px-4 lg:px-0">
											<div className="flex flex-row items-center justify-between">
												<div className="flex flex-row items-center gap-2">
													<div className="w-2 h-2 bg-accent rounded-full"></div>
													<p className="lg:text-xl text-lg">
														Popular Today
													</p>
												</div>
												<Link
													className="px-4 py-2 bg-foreground/20 flex flex-row gap-4 items-center rounded-[8px] hover:bg-foreground/40"
													href={"#explore"}
												>
													<p className="lg:text-lg text-md">
														View More
													</p>
													<img
														src="/assets/icons/caret-right-solid.svg"
														alt=""
														width={10}
														height={10}
														className="invert mx-4"
													/>
												</Link>
											</div>
											{memoizedMediaCards(
												index,
												media.averageColor
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
			</Slider>
		</div>
	);
};

export default React.memo(TopMoviesCarousel);
