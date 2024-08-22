"use client";

import { useEffect, useState } from "react";

export default function VersionDisplay() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const response = await fetch("/api/version");
        const data = await response.json();
        setVersion(data.version);
      } catch (error) {
        console.error("Failed to fetch version:", error);
      }
    }

    fetchVersion();
  }, []);

  return <p className="">Version: {version.slice(-5)}</p>;
}
