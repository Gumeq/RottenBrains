import {
  getPersonCredits,
  getPersonDetails,
  getPersonImages,
} from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

type Params = Promise<{ person_id: number }>;

const page = async ({ params }: { params: Params }) => {
  const { person_id } = await params;
  const person_details = await getPersonDetails(person_id);
  return (
    <div className="py-4 lg:w-screen">
      <div>
        <img
          src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
          alt=""
          className="mask2 absolute top-0 h-[300vh] w-screen overflow-hidden object-cover opacity-30 blur-[100px] lg:h-[150vh]"
        />
      </div>
      <div className="relative z-10 h-auto w-screen lg:h-screen lg:w-auto">
        <div className="relative flex h-auto w-screen lg:h-screen lg:w-auto">
          <div className="mx-auto flex h-full w-screen flex-col gap-4 px-2 lg:my-8 lg:w-auto lg:gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-4xl text-foreground">{person_details.name}</p>
              <div className="">
                <div className="flex h-full flex-col justify-between gap-2 lg:flex-row lg:items-center">
                  <div className="flex flex-row items-center gap-4 opacity-50">
                    <p className="">{person_details.birthday}</p>
                    <div className="h-2 w-2 rounded-full bg-foreground"></div>
                    <p>{person_details.known_for_department}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-auto flex-col gap-4 lg:h-[45%] lg:flex-row lg:gap-8">
              <div className="max-h-full">
                <img
                  src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
                  alt=""
                  className="h-full rounded-[4px] drop-shadow-lg"
                />
              </div>
              <div className="aspect-[16/9] h-full overflow-auto rounded-[4px] drop-shadow-lg">
                <div className="flex flex-row gap-4">
                  <p className="w-[100px] text-xl font-bold text-foreground/50">
                    Biography
                  </p>
                  <p className="w-full">{person_details.biography}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
