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
        <div className="h-1/4 w-full">
          <MediaCardExploreMain
            media={movies[index + 1] || movies[0]}
            color={color}
          />
        </div>
        <div className="h-1/4 w-full">
          <MediaCardExploreMain
            media={movies[index + 2] || movies[1]}
            color={color}
          />
        </div>
        <div className="h-1/4 w-full">
          <MediaCardExploreMain
            media={movies[index + 3] || movies[2]}
            color={color}
          />
        </div>
      </div>
    ),
    [movies],
  );

  return (
    <div className="h-[50vh] w-full text-foreground lg:h-auto">
      <Slider {...settings}>
        {movies &&
          movies.slice(0, 5).map((media: any, index: number) => {
            const watchLink =
              media.media_type === "movie"
                ? `/protected/watch/${media.media_type}/${media.id}`
                : `/protected/watch/${media.media_type}/${media.id}/1/1`;
            return (
              <div className="h-[50vh] w-full md:h-[90vh]" key={index}>
                <div className="relative h-full w-full">
                  <div className="absolute right-0 top-0 z-20 flex h-full w-full flex-col justify-end">
                    <div className="w-full">
                      <div className="mx-auto flex h-full w-[90%] flex-col gap-8">
                        <div className="flex h-full flex-col gap-4 lg:w-1/2 lg:gap-16">
                          <div>
                            <h1 className="truncate pb-2 text-2xl text-foreground/80 lg:py-4 lg:pb-8 lg:text-4xl">
                              {media.title || media.name}
                            </h1>
                            <h2 className="line-clamp-2 text-lg text-foreground/50 lg:text-2xl">
                              {media.overview}
                            </h2>
                          </div>
                          <Link className="flex" href={watchLink}>
                            <div className="rounded-full border-4 border-transparent bg-foreground px-2 py-1 text-lg font-medium text-background transition ease-in-out hover:border-foreground hover:bg-transparent hover:text-foreground lg:px-4 lg:py-2 lg:text-2xl">
                              Watch Now
                            </div>
                          </Link>
                        </div>
                        <div className="hidden flex-row justify-between gap-8 p-2 lg:flex lg:w-full">
                          {movies
                            .slice(index + 1, index + 5)
                            .map((movie: any) => {
                              return (
                                <Link
                                  className="relative overflow-hidden rounded-[16px] border-4 border-foreground/0 drop-shadow-lg transition ease-in-out hover:scale-110 hover:border-white/80"
                                  href={"/"}
                                >
                                  <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                    alt=""
                                    className="aspect-[16/9] w-full"
                                  />
                                  <div className="absolute left-0 top-0 z-10 h-full w-full bg-black/30"></div>
                                  <div className="absolute bottom-0 z-20 flex flex-col gap-2 px-4 py-2 text-white">
                                    <p className="line-clamp-1 text-xl">
                                      {movie.title || movie.name}
                                    </p>
                                    <p className="line-clamp-2 text-white/80">
                                      {movie.overview}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gradient-explore absolute right-0 top-0 z-10 h-full w-full"></div>
                  <img
                    src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                    alt=""
                    className="h-full object-cover lg:w-full"
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
