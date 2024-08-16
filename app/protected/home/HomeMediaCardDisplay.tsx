import Link from "next/link";
import React from "react";

const HomeMediaCardDisplay = (media: any) => {
  media = media.media;
  let media_type: string;
  if ("title" in media) {
    media_type = "movie";
  } else {
    media_type = "tv";
  }
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <>
          <Link
            href={`/protected/media/${media_type}/${media.id}`}
            className="relative"
          >
            <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-[8px]">
              <picture>
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt=""
                  className="h-full w-full bg-background"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="absolute bottom-0 w-full p-1 lg:p-2">
              <div className="flex w-full flex-row justify-between md:gap-2">
                <div className="flex flex-row items-center justify-center gap-1 rounded-[7px] bg-black/20 px-2 py-1 font-bold text-white backdrop-blur-xl lg:rounded-[6px]">
                  <img
                    src="/assets/icons/star-solid.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="invert-on-dark"
                  />
                  {media.vote_average.toFixed(1)}
                </div>
                <div className="flex flex-row items-center justify-center gap-1 rounded-[7px] bg-black/20 px-2 py-1 font-bold text-white backdrop-blur-xl lg:rounded-[6px]">
                  {media.release_date
                    ? media.release_date.slice(0, 4)
                    : media.first_air_date && media.first_air_date.slice(0, 4)}
                </div>
              </div>
            </div>
          </Link>
        </>
      </div>
    </div>
  );
};

export default HomeMediaCardDisplay;
