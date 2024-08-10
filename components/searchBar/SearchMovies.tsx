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
import clsx from "clsx";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import SearchCard from "./SearchCard";
import Link from "next/link";
import { searchUsers } from "@/utils/clientFunctions/searchUsers";
import SearchUserCard from "./SearchUserCard";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

const SearchMovies = ({ media, setMedia, link, user }: any) => {
	const [query, setQuery] = useState<string>("");
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [dataUsers, setDataUsers] = useState<any>(null);
	const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
	const router = useRouter();

	const debouncedSearch = useCallback(
		debounce(async (query: string) => {
			if (query.startsWith("@")) {
				setLoadingUsers(true);
				try {
					const userQuery = query.slice(1);
					const result = await searchUsers(userQuery);
					setDataUsers(result);
				} catch (err) {
					console.error("Failed to fetch data", err);
				} finally {
					setLoadingUsers(false);
				}
			} else {
				setLoading(true);
				try {
					const result = await searchMovies(query);
					setData(result);
				} catch (err) {
					console.error("Failed to fetch data", err);
				} finally {
					setLoading(false);
				}
			}
		}, 300),
		[]
	);

	useEffect(() => {
		if (query) {
			debouncedSearch(query);
		} else {
			setData(null);
			setDataUsers(null);
		}
	}, [query, debouncedSearch]);

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleSelect = (selected: any) => {
		if (link) {
			if (selected) {
				if (selected.username) {
					// Redirect to user profile
					router.push(`/protected/user/${selected.id}`);
				} else {
					// Redirect to movie page
					router.push(
						`/protected/media/${selected.media_type}/${selected.id}`
					);
				}
			}
		} else {
			setMedia(selected);
		}
	};

	const renderOptions = useCallback(() => {
		if (loadingUsers && query.startsWith("@")) {
			return <div className="text-sm/6 text-white">Loading users...</div>;
		}
		if (loading) {
			return (
				<div className="text-sm/6 text-white">Loading movies...</div>
			);
		}
		if (dataUsers) {
			return dataUsers.slice(0, 4).map((user: any) => (
				<ComboboxOption
					key={user.id}
					value={user}
					className="group flex items-center gap-4 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
				>
					<div className="text-sm/6 text-white">
						<SearchUserCard user={user} />
					</div>
				</ComboboxOption>
			));
		}
		return data?.results.slice(0, 4).map((media: any) => (
			<ComboboxOption
				key={media.id}
				value={media}
				className="group flex items-center gap-4 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
			>
				<div className="text-sm/6 text-white">
					{link ? (
						<Link
							href={`/protected/media/${media.media_type}/${media.id}`}
						>
							<SearchCard media={media} />
						</Link>
					) : (
						<SearchCard media={media} />
					)}
				</div>
			</ComboboxOption>
		));
	}, [data, dataUsers, loading, loadingUsers, query, link]);

	return (
		<div className="w-full">
			<Combobox value={media} onChange={handleSelect}>
				<div className="relative">
					<ComboboxInput
						className={clsx(
							"w-full rounded-full border border-foreground/20 bg-background py-1.5 pr-8 pl-3 text-sm/6 text-foreground",
							"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-foreground/25"
						)}
						displayValue={(media: any) => media?.title}
						onChange={handleQueryChange}
						placeholder="Search Rotten Brains"
					/>
					<ComboboxButton className="group absolute inset-y-0 right-0 px-4">
						<img
							src={"/assets/icons/search.svg"}
							alt={""}
							width={20}
							height={20}
							className="invert-on-dark opacity-70"
						/>
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
						{renderOptions()}
					</ComboboxOptions>
				</Transition>
			</Combobox>
		</div>
	);
};

export default SearchMovies;
