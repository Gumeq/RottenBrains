import Loader from "@/components/Loader";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader></Loader>
    </div>
  );
};

export default loading;
