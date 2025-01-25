"use client";

import React, { useEffect, useState } from "react";

const NativeAd = () => {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    let scriptLoaded = false;

    // We'll wait up to 3 seconds for the script to load.
    const timeoutId = setTimeout(() => {
      if (!scriptLoaded) {
        setAdBlocked(true);
      }
    }, 3000);

    // Create the script element
    const adScript = document.createElement("script");
    adScript.async = true;
    adScript.setAttribute("data-cfasync", "false");
    adScript.src =
      "//pl25669917.profitablecpmrate.com/72f3e6514b457b5ab0dfaeaf7714bd49/invoke.js";

    // Script loaded successfully
    adScript.onload = () => {
      scriptLoaded = true;
      clearTimeout(timeoutId);
    };

    // Script failed to load (likely blocked)
    adScript.onerror = () => {
      setAdBlocked(true);
      clearTimeout(timeoutId);
    };

    // Append script to the document (or to a specific DOM element)
    // Here we append to body so the script can find the container by its ID.
    document.body.appendChild(adScript);

    // Cleanup: remove timeout and script if component unmounts
    return () => {
      clearTimeout(timeoutId);
      // Optional: remove the script to avoid duplicates
      if (document.body.contains(adScript)) {
        document.body.removeChild(adScript);
      }
    };
  }, []);

  // Show fallback if ad is blocked
  if (adBlocked) {
    return (
      <div className="flex h-full min-h-32 w-full items-center justify-center bg-red-500 text-white">
        Ad Blocked / Could not display ad
      </div>
    );
  }

  // Show the ad container. The ad script will inject content into this div by ID.
  return (
    <div
      id="container-72f3e6514b457b5ab0dfaeaf7714bd49"
      className="h-full w-full text-sm text-foreground"
    />
  );
};

export default NativeAd;
