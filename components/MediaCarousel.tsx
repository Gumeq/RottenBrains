"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const TopMoviesCarousel = ({ movies }: any) => {
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 10000,
	};

	return (
		<div className="">
			<Slider {...settings}>
				{movies &&
					movies.map((media: any, index: number) => {
						return (
							<div className="relative h-[50vh] w-full">
								<div className="absolute inset-0 bg-cover">
									<img
										src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
										alt="Background Image"
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
											objectPosition: "top",
											position: "absolute",
											top: 0,
											left: 0,
										}}
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
								<div className="relative w-full h-full flex justify-center items-end p-16 flex-row">
									<div className="flex flex-col items-center gap-4">
										<p className="text-4xl font-bold">
											{media.title || media.name}
										</p>
										<div className="opacity-60 flex flex-row gap-2">
											<div className="flex flex-row items-center justify-center gap-2">
												<p>
													{media.release_date?.slice(
														0,
														4
													) ||
														media.first_air_date.slice(
															0,
															4
														)}
												</p>
												<img
													src="/assets/icons/star-solid.svg"
													alt=""
													className="invert-on-dark w-[15px] h-[15px]"
												/>
												<p>
													{media.vote_average.toFixed(
														1
													)}
												</p>
											</div>
										</div>
										<div className="flex flex-row gap-4 font-bold">
											<Link
												href={
													media.type === "movie"
														? `/protected/watch/${media.media_type}/${media.id}`
														: `/protected/watch/${media.media_type}/${media.id}/1/1`
												}
											>
												<div className="px-4 py-2 bg-accent rounded-full">
													<p>Watch</p>
												</div>
											</Link>
											<Link href={"/protected/media/"}>
												<div className="px-4 py-2 border-2 border-accent rounded-full">
													<p>Info</p>
												</div>
											</Link>
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

export default TopMoviesCarousel;
