import { searchMulti } from "@/utils/tmdb";
import React from "react";
import InfiniteScrollSearch from "./InfiniteScrollSearch";

type Params = Promise<{ query: string }>;

const page = async ({ searchParams }: { searchParams: Params }) => {
  const { query } = await searchParams;
  return <InfiniteScrollSearch query={query}></InfiniteScrollSearch>;
};

export default page;
