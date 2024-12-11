import React, { FC } from "react";

interface MediaInfoTextProps {
  text: string;
}

const MediaInfoText: FC<MediaInfoTextProps> = ({ text }) => {
  return (
    <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
      {text}
    </div>
  );
};

export default MediaInfoText;
