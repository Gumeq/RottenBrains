import {
	getPersonCredits,
	getPersonDetails,
	getPersonImages,
} from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

async function getAndSortPersonCredits(person_id: number) {
	try {
		// Get the credits for the person
		let credits = await getPersonCredits(person_id);
		credits = credits.cast;

		// Remove duplicates based on title or name
		const uniqueCredits = credits.filter(
			(credit: any, index: any, self: any) =>
				index ===
				self.findIndex(
					(c: any) =>
						(c.title || c.name) === (credit.title || credit.name)
				)
		);

		// Sort the credits by popularity in descending order
		uniqueCredits.sort((a: any, b: any) => b.popularity - a.popularity);

		return uniqueCredits;
	} catch (error) {
		console.error("Error fetching or sorting credits:", error);
		return [];
	}
}

const page = async ({ params }: { params: { person_id: number } }) => {
	const person_id = params.person_id;
	const person_details = await getPersonDetails(person_id);
	console.log(person_details);
	const images = await getPersonImages(person_id);
	console.log(images);
	const credits = await getAndSortPersonCredits(person_id);
	console.log(credits);
	return (
		<div className="lg:w-screen py-4">
			<div>
				<img
					src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
					alt=""
					className="w-screen lg:h-[150vh] h-[300vh] object-cover blur-[100px] absolute top-0 mask2 opacity-30 overflow-hidden"
				/>
			</div>
			<div className=" relative lg:h-screen h-auto w-screen lg:w-auto">
				<div className=" relative lg:h-screen h-auto flex w-screen lg:w-auto">
					<div className="h-full mx-auto flex flex-col lg:gap-8 gap-4 w-screen lg:w-auto px-2 lg:my-8">
						<div className=" flex flex-col gap-4">
							<p className="text-4xl text-foreground ">
								{person_details.name}
							</p>
							<div className="">
								<div className="flex lg:flex-row flex-col justify-between lg:items-center gap-2 h-full">
									<div className="flex flex-row gap-4 items-center opacity-50">
										<p className="">
											{person_details.birthday}
										</p>
										<div className="w-2 h-2 bg-foreground rounded-full"></div>
										<p>
											{
												person_details.known_for_department
											}
										</p>
									</div>
									{/* <div className="flex flex-row gap-4 items-center justify-between h-full">
										<Link
											href={`/protected/create-post/${media_type}/${media_id}`}
											className=" flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg"
										>
											<img
												src="/assets/icons/star-outline.svg"
												alt=""
												width={20}
												height={20}
												className="invert-on-dark"
												loading="lazy"
											/>
											<p className="text-lg">Rate</p>
										</Link>
										<div className=" bg-foreground/20 flex flex-row items-center gap-2 rounded-[8px] px-6 py-2 drop-shadow-lg">
											<img
												src="/assets/icons/star-solid.svg"
												alt=""
												width={20}
												height={20}
												className="invert-on-dark"
												loading="lazy"
											/>
											<p className="text-foreground/50">
												<span className="text-foreground/100 text-lg">
													{media.vote_average.toFixed(
														1
													)}
												</span>
												/10{" "}
												<span>
													(
													{formatNumber(
														media.vote_count
													)}
													)
												</span>
											</p>
										</div>
									</div> */}
								</div>
							</div>
						</div>
						<div className="lg:h-[45%] h-auto flex lg:flex-row flex-col lg:gap-8 gap-4 ">
							<div className="h-full   ">
								<img
									src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
									alt=""
									className="h-full rounded-[4px] drop-shadow-lg"
								/>
							</div>
							<div className="h-full relative">
								<div className="h-full aspect-[3/2] grid">
									{credits.map((credit: any) => (
										<div>
											<img
												src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
												alt=""
											/>
										</div>
									))}
								</div>
							</div>
						</div>
						{/* <div className=" px-2 flex flex-row gap-4 lg:w-auto w-full">
							<div className="flex flex-col gap-4">
								<div className="flex flex-row items-center gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Genre
									</p>
									<div className="flex flex-row gap-2 xl:w-[600px] lg:w-[300px] w-[60vw] flex-wrap">
										{mediaData.genres.map((genre: any) => (
											<div className="px-6 py-2 bg-foreground/20 rounded-full text-center flex items-center">
												{genre.name}
											</div>
										))}
									</div>
								</div>
								<div className="flex flex-row gap-4">
									<p className="font-bold text-xl text-wrap text-foreground/50 w-[100px]">
										Plot
									</p>
									<p className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{mediaData.overview}
									</p>
								</div>

								<div className="flex flex-row gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										{media_type === "movie"
											? "Director"
											: "Creator"}
									</p>
									<div className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{media_type === "movie"
											? mediaCredits.directorOrCreator
													?.name
											: mediaData.created_by[0].name}
									</div>
								</div>

								<div className="flex flex-row gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Writers
									</p>
									<p className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										<div className="flex flex-row">
											{mediaCredits.writers
												? mediaCredits.writers.map(
														(writer, index) => (
															<Link
																href={`/protected/person/${writer.id}`}
																key={index}
															>
																{writer.name},
															</Link>
														)
												  )
												: "N/A"}
										</div>
									</p>
								</div>

								<div className="flex flex-row gap-4">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Stars
									</p>
									<p className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{mediaCredits.actors
											? mediaCredits.actors
													.slice(0, 5)
													.map((actor, index) => (
														<Link
															href={`/protected/person/${actor.id}`}
															key={index}
														>
															{actor.name},{" "}
														</Link>
													))
											: "N/A"}
									</p>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
