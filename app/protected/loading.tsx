import Loader from "@/components/Loader";
import LoaderNew from "@/components/LoaderNew";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center lg:h-full lg:w-full">
      <LoaderNew></LoaderNew>
    </div>
  );
};

export default loading;
