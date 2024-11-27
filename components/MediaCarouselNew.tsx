"use client";

import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { divide } from "lodash";
import { getGenreNameById } from "@/lib/functions";

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
    arrows: false,
  };

  return (
    <div className="w-full lg:px-4">
      <Slider {...settings} className="h-full w-full">
        {movies &&
          movies.slice(0, 5).map((media: any, index: number) => {
            const watchLink =
              media.media_type === "movie"
                ? `/protected/watch/${media.media_type}/${media.id}`
                : `/protected/watch/${media.media_type}/${media.id}/1/1`;
            console.log(media);
            return (
              <Link
                href={watchLink}
                className="h-[80vh] w-full overflow-hidden lg:rounded-[16px]"
                key={index}
              >
                <div className="h-full w-full">
                  <div className="relative h-full w-full">
                    <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col justify-between p-4 lg:p-8">
                      <div className="self-start rounded-full bg-black/20 px-3 py-1 backdrop-blur-xl">
                        🔥Now Popular
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2">
                          {media.genre_ids.slice(0, 2).map((genre: any) => {
                            return (
                              <div className="rounded-full bg-black/20 px-3 py-1 text-sm backdrop-blur-xl">
                                {getGenreNameById(genre)}
                              </div>
                            );
                          })}
                        </div>
                        <h2 className="text-4xl font-bold">
                          {media.title || media.name}
                        </h2>
                        <h3 className="line-clamp-[4] lg:w-1/3">
                          {media.overview}
                        </h3>
                        <div className="flex flex-col gap-4 lg:flex-row">
                          <div className="flex flex-row items-center gap-2 rounded-full bg-white px-6 py-3 text-lg text-black">
                            <img
                              src="/assets/icons/play-solid.svg"
                              alt=""
                              className="h-[20px] w-[20px]"
                            />
                            <p>Watch Now</p>
                          </div>
                          <div className="rounded-full bg-black/20 px-6 py-3 text-lg backdrop-blur-xl">
                            View Details
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="gradient-explore absolute right-0 top-0 z-10 h-full w-full"></div>
                    <img
                      src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                      alt=""
                      className="h-full w-full bg-background object-cover object-center"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
      </Slider>
    </div>
  );
};

export default React.memo(TopMoviesCarouselNew);
