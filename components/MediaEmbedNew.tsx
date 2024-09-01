import React from "react";

const MediaEmbedNew = ({ embedLink }: any) => {
  return (
    <div>
      <iframe
        allowFullScreen
        id="iframe"
        loading="lazy"
        src={embedLink}
        className="aspect-[16/9] w-screen lg:w-full"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default MediaEmbedNew;
