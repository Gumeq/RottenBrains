"use client";

import { searchMovies } from "@/utils/tmdb";
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, ChangeEvent, useEffect } from "react";
import SearchCard from "./SearchCard";
import Link from "next/link";
import { Divide } from "lucide-react";
import Image from "next/image";

// Define the type for the person object
interface Person {
	id: number;
	name: string;
}

// Sample data
const people: Person[] = [
	{ id: 1, name: "Tom Cook" },
	{ id: 2, name: "Wade Cooper" },
	{ id: 3, name: "Tanya Fox" },
	{ id: 4, name: "Arlene Mccoy" },
	{ id: 5, name: "Devon Webb" },
];

const SearchMovies = ({ media, setMedia, link }: any) => {
	// State types
	const [query, setQuery] = useState<string>("");
	const [selected, setSelected] = useState<Person>(people[1]);
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const getData = async (query: string) => {
			try {
				const result = await searchMovies(query);
				setData(result);
				console.log(data);
			} catch (err) {
				console.error("Failed to fetch data", err);
			} finally {
				setLoading(false);
			}
		};

		getData(query);
	}, [query]);

	return (
		<div className="w-full ">
			<Combobox value={media} onChange={setMedia}>
				<div className="relative">
					<ComboboxInput
						className={clsx(
							"w-full rounded-lg border-none bg-foreground/10 py-1.5 pr-8 pl-3 text-sm/6 text-foreground",
							"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-foreground/25"
						)}
						displayValue={(media: any) => media?.title}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setQuery(event.target.value)
						}
					/>
					<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
						<Image
							src={"/assets/icons/magnifying-glass-solid.svg"}
							alt={""}
							width={20}
							height={20}
							className="invert-on-dark opacity-70"
						></Image>
					</ComboboxButton>
				</div>
				<Transition
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}
				>
					<ComboboxOptions
						anchor="bottom"
						className="w-[var(--input-width)] z-40 rounded-xl border border-white/5 bg-background p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
					>
						{!loading &&
							data.results.slice(0, 4).map((media: any) => (
								<div>
									{link ? (
										<Link
											href={`/protected/media/${media.media_type}/${media.id}`}
										>
											<ComboboxOption
												key={media.id}
												value={media}
												className="group flex cursor-default items-center gap-4 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
											>
												<div className="text-sm/6 text-white">
													<SearchCard media={media} />
												</div>
											</ComboboxOption>
										</Link>
									) : (
										<div>
											<ComboboxOption
												key={media.id}
												value={media}
												className="group flex cursor-default items-center gap-4 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
											>
												<div className="text-sm/6 text-white">
													<SearchCard media={media} />
												</div>
											</ComboboxOption>
										</div>
									)}
								</div>
							))}
					</ComboboxOptions>
				</Transition>
			</Combobox>
		</div>
	);
};

export default SearchMovies;
