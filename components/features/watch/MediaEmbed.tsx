import Link from "next/link";

const VideoEmbed = ({}) => {
  return (
    <section className="fixed left-0 top-0 z-30 w-screen flex-col bg-background lg:relative lg:z-0 lg:w-full lg:pb-0">
      {/* Mobile top bar */}
      <div className="flex h-10 w-full items-center gap-4 bg-background px-2 lg:hidden">
        <Link href="/" className="px-2">
          <img
            src="/assets/images/logo_text_new.svg"
            alt="RottenBrains Logo"
            className="invert-on-dark h-3 w-auto"
          />
        </Link>
      </div>
      <div className="w-screen lg:w-full">
        <div
          id="video-inline-placeholder"
          className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/10 lg:rounded-[8px]"
        />
      </div>
    </section>
  );
};

export default VideoEmbed;
