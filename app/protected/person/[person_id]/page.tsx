import {
	getPersonCredits,
	getPersonDetails,
	getPersonImages,
} from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

async function getAndSortPersonCredits(person_id: number) {
	// Define unwanted genre IDs
	const unwantedGenreIds = [10767, 10770]; // Example: Talk Show, TV Movie

	try {
		// Get the person's details
		const personDetails = await getPersonDetails(person_id);
		const knownForDepartment = personDetails.known_for_department;

		// Get the credits for the person
		let credits = await getPersonCredits(person_id);
		credits = credits.cast;

		// Filter by known for department and unwanted genres
		const filteredCredits = credits.filter((credit: any) => {
			const genreIds = credit.genre_ids || [];
			const hasCorrectRole =
				knownForDepartment === "Acting"
					? !!credit.character
					: credit.job === knownForDepartment;
			return (
				hasCorrectRole &&
				!genreIds.some((genreId: number) =>
					unwantedGenreIds.includes(genreId)
				)
			);
		});

		// Remove duplicates based on title or name
		const uniqueCredits = filteredCredits.filter(
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
	const images = await getPersonImages(person_id);
	console.log(images);
	const credits = await getAndSortPersonCredits(person_id);
	return (
		<div className="lg:w-screen py-4">
			<div>
				<img
					src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
					alt=""
					className="w-screen lg:h-[150vh] h-[300vh] object-cover blur-[100px] absolute top-0 mask2 opacity-30 overflow-hidden"
				/>
			</div>
			<div className=" relative lg:h-screen h-auto w-screen lg:w-auto z-10">
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
								</div>
							</div>
						</div>
						<div className="lg:h-[45%] h-auto flex lg:flex-row flex-col lg:gap-8 gap-4 ">
							<div className="max-h-full">
								<img
									src={`https://image.tmdb.org/t/p/w500${person_details.profile_path}`}
									alt=""
									className="h-full rounded-[4px] drop-shadow-lg"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
