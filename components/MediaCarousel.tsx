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

const TopMoviesCarousel = ({ movies }: any) => {
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
    <div className="h-auto w-full text-foreground md:h-screen">
      <Slider {...settings}>
        {movies &&
          movies.map((media: any, index: number) => {
            const watchLink =
              media.media_type === "movie"
                ? `/protected/watch/${media.media_type}/${media.id}`
                : `/protected/watch/${media.media_type}/${media.id}/1/1`;
            return (
              <div className="h-full w-full md:h-screen md:px-0" key={index}>
                <div
                  className="flex h-full w-full items-center justify-center md:h-full"
                  // style={{
                  // 	backgroundImage: `radial-gradient(circle, ${media.averageColor} 0%, black 100%)`,
                  // }}
                >
                  <div className="flex h-full w-[100%] flex-col gap-8 md:w-[80%] md:flex-row lg:py-[6.5rem]">
                    <div className="flex w-[100%] items-start md:w-[90%] xl:w-[70%]">
                      <div className="relative flex aspect-[3/2] h-auto w-full flex-col">
                        <div className="h-[10%] md:h-[40%]"></div>
                        <div className="z-10 flex h-[100%] flex-row md:h-[60%] md:gap-4">
                          <Link
                            href={`/protected/media/${media.media_type}/${media.id}`}
                            className="mx-4 aspect-[2/3] min-h-[100%] w-auto rounded-[8px] drop-shadow-xl"
                          >
                            <LazyImage
                              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
                              alt="Poster Image"
                              className={
                                "inset-0 h-full w-full rounded-[8px] object-cover"
                              }
                            />
                          </Link>

                          <div className="flex h-full w-full flex-col md:justify-end">
                            <div className="flex h-full w-full flex-col items-center gap-4 md:h-[50%] md:flex-row xl:h-[30%]">
                              <Link
                                href={watchLink}
                                className="relative flex h-[50%] w-auto items-center justify-center rounded-full bg-foreground/20 backdrop-blur-md hover:bg-foreground/40 md:h-full"
                                style={{
                                  aspectRatio: "1 / 1",
                                }}
                              >
                                <img
                                  src="/assets/icons/play-solid.svg"
                                  alt=""
                                  className="ml-[5%] h-[40%] w-[40%] invert"
                                />
                              </Link>
                              <div className="flex flex-col gap-2 text-center md:text-left">
                                <p className="text-xl md:text-2xl lg:text-4xl">
                                  {media.title || media.name}
                                </p>
                                <p className="text-xl opacity-60 md:text-2xl">
                                  Watch now
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-0 h-full w-full">
                          <div className="absolute right-0 z-20 m-4 hidden flex-row items-center gap-2 rounded-[4px] bg-background/50 px-6 py-2 drop-shadow-lg lg:flex">
                            <img
                              src="/assets/icons/star-solid.svg"
                              alt=""
                              width={20}
                              height={20}
                              className="invert-on-dark"
                              loading="lazy"
                            />
                            <p className="text-foreground/50">
                              <span className="text-lg text-foreground/100">
                                {media.vote_average.toFixed(1)}
                              </span>
                              /10{" "}
                              <span>({formatNumber(media.vote_count)})</span>
                            </p>
                          </div>
                          <LazyImage
                            src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
                            alt="Background Image"
                            className="mask1 inset-0 aspect-[3/2] h-full w-full object-cover opacity-80 md:rounded-[8px]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex h-full w-full flex-col gap-4 px-4 md:h-[60%] md:w-[30%] md:gap-8 md:px-0">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-accent"></div>
                          <p className="text-lg md:text-xl">Popular Today</p>
                        </div>
                        <Link
                          className="flex flex-row items-center gap-4 rounded-[8px] bg-foreground/20 px-4 py-2 hover:bg-foreground/40"
                          href={"#explore"}
                        >
                          <p className="text-md md:text-lg">View More</p>
                          <img
                            src="/assets/icons/caret-right-solid.svg"
                            alt=""
                            width={10}
                            height={10}
                            className="mx-4 invert"
                          />
                        </Link>
                      </div>
                      {memoizedMediaCards(index, media.averageColor)}
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
