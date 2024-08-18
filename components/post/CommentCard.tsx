"use client";
import { getUserFromDB } from "@/utils/supabase/queries";
import React, { useEffect, useState } from "react";
import { timeAgo } from "./TimeAgo";

const CommentCard = ({ comment }: any) => {
  const creator = comment.users;
  if (!creator) {
    return <p>loading...</p>;
  }

  return (
    <div className="w-full rounded-[8px] bg-foreground/10">
      <div className="flex w-11/12 flex-row gap-4 p-2">
        <div className="">
          <img
            src={creator.image_url}
            alt={" "}
            width={30}
            height={30}
            className="h-[30px] w-[30px] rounded-full"
          ></img>
        </div>
        <div className="flex w-10/12 flex-col">
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm font-bold">{creator.username}</p>
            <p className="text-xs">{timeAgo(comment.created_at)}</p>
          </div>
          <div className="break-words">
            <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
