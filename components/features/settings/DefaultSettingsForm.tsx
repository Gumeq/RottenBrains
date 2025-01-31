"use client";

import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface FormData {
  video_provider: string;
}

export const videoProviders = [
  { name: "VIDSRC.PRO", link: "https://vidsrc.pro/embed/" },
  { name: "VIDSRC.NET", link: "https://vidsrc.net/embed/" },
  { name: "VIDSRC.CC", link: "https://vidsrc.cc/v2/embed/" },
  { name: "SUPEREMBED", link: "/api/testapi" },
  { name: "2EMBED", link: "https://www.2embed.cc/embed" },
];

// src={`/api/testapi?video_id=${media_id}&tmdb=1&season=4&episode=22`}
// src={`https://www.2embed.cc/embed${media_type === "tv" ? "tv" : ""}/${media_id}${media_type == "tv" ? episode_season_string : ""}`}

const DefaultSettingsForm = () => {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    video_provider: "SUPEREMBED", // Default selection
  });

  const { toast } = useToast();

  // Load the selected video provider from local storage when the component mounts
  useEffect(() => {
    const storedProvider = localStorage.getItem("video_provider");
    if (storedProvider) {
      setFormData({ video_provider: storedProvider });
    }
  }, []);

  // Function to handle provider selection
  const handleProviderSelection = (provider: any) => {
    setFormData({ video_provider: provider });
    localStorage.setItem("video_provider", provider.link); // Save the selected provider to local storage

    toast({
      title: "Provider Changed",
      description: `${provider.name} has been set as your default video provider.`,
    });
  };

  return (
    <div className="">
      <form>
        <p className="mg-2 block font-medium">Watch provider</p>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
          {videoProviders.map((provider) => (
            <div
              key={provider.name}
              onClick={() => handleProviderSelection(provider)}
              className={`cursor-pointer rounded-[4px] border px-4 py-2 ${
                formData.video_provider &&
                formData.video_provider === provider.link
                  ? "border-accent" // Highlight the selected provider
                  : "border-foreground/10"
              }`}
            >
              {provider.name}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default DefaultSettingsForm;
