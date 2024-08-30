"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addToWatchList, updateGenreStats } from "@/utils/supabase/queries";
import { useToast } from "@/components/ui/use-toast";

type MoreOptionsProps = {
  user_id: string;
  media_type: string;
  media_id: number;
  genre_ids: bigint[];
};

const MoreOptions = ({
  user_id,
  media_type,
  media_id,
  genre_ids,
}: MoreOptionsProps) => {
  const [isSaving, setIsSaving] = useState<string | null>(null); // Set initial state to null

  const { toast } = useToast();

  const handleSaveToWatchLater = () => {
    setIsSaving("watch_later");
  };
  const handleSaveToWatching = () => {
    setIsSaving("watching");
  };
  const handleSaveToPlanned = () => {
    setIsSaving("planned");
  };
  const handleSaveToWatched = () => {
    setIsSaving("watched");
  };

  useEffect(() => {
    const saveData = async () => {
      if (isSaving !== null) {
        // Only proceed if isSaving is not null
        try {
          const data = await addToWatchList(
            user_id,
            media_type,
            media_id,
            isSaving,
          );
          if (!data.includes("Error")) {
            await updateGenreStats({
              genreIds: genre_ids,
              mediaType: media_type,
              userId: user_id,
            });
          }
          toast({
            title: data,
          });
        } catch (error) {
          console.error("Error saving to watch list", error);
        } finally {
          setIsSaving(null); // Reset isSaving to null after the operation
        }
      }
    };

    saveData();
  }, [isSaving, user_id, media_type, media_id, toast]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <img
            src="/assets/icons/more-vert.svg"
            alt=""
            className="invert-on-dark"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="right-0 border-none bg-[#3F3F3F] drop-shadow-md"
          align="start"
        >
          <DropdownMenuItem className="hover:bg-[#6f6f6f]">
            <div
              className="flex h-full w-full flex-row items-center gap-2 hover:cursor-pointer"
              onClick={handleSaveToWatchLater}
            >
              <img
                src="/assets/icons/time-outline.svg"
                alt=""
                className="invert-on-dark h-[24px] w-[24px]"
              />
              <p>Save to Watch later</p>
            </div>
          </DropdownMenuItem>
          <div className="my-1 h-[1px] w-full bg-foreground/10"></div>
          <DropdownMenuItem className="hover:bg-[#6f6f6f]">
            <div
              className="flex h-full w-full flex-row items-center gap-2 hover:cursor-pointer"
              onClick={handleSaveToWatching}
            >
              <img
                src="/assets/icons/folder-outline.svg"
                alt=""
                className="invert-on-dark h-[24px] w-[24px]"
              />
              <p>Watching</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#6f6f6f]">
            <div
              className="flex h-full w-full flex-row items-center gap-2 hover:cursor-pointer"
              onClick={handleSaveToPlanned}
            >
              <img
                src="/assets/icons/folder-outline.svg"
                alt=""
                className="invert-on-dark h-[24px] w-[24px]"
              />
              <p>Planned</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#6f6f6f]">
            <div
              className="flex h-full w-full flex-row items-center gap-2 hover:cursor-pointer"
              onClick={handleSaveToWatched}
            >
              <img
                src="/assets/icons/folder-outline.svg"
                alt=""
                className="invert-on-dark h-[24px] w-[24px]"
              />
              <p>Watched</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MoreOptions;
