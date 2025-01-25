import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <nav className="flex h-16 w-full justify-center bg-background">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          <div className="text-xl font-bold">
            <img
              src="/assets/images/logo_text_new.svg"
              alt=""
              className="invert-on-dark h-4 w-auto"
            />
          </div>
          {<AuthButton />}
        </div>
      </nav>
      <div className="my-16 flex w-screen max-w-4xl flex-col items-center justify-center gap-4 px-8">
        <img
          src="/assets/images/logo-text-new.svg"
          alt="logo-text.png"
          className="invert-on-dark"
        />
        <h1 className="max-w-xl text-center text-2xl font-bold text-foreground opacity-80">
          Review movies, share with friends, and watch your favorites all in one
          place.
        </h1>
        <div className="flex flex-col gap-4 md:flex-row">
          <Link href={"/protected/home"}>
            <div className="my-4 rounded-lg bg-accent px-8 py-4 text-xl font-bold">
              Get Started
            </div>
          </Link>
          <Link href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>
            <div className="my-4 rounded-lg border-2 border-accent px-8 py-4 text-xl font-bold">
              Hmmm...
            </div>
          </Link>
        </div>
      </div>
      <div className="flex w-screen justify-center bg-accent/10 p-4 py-8">
        <div className="my-4 flex w-screen max-w-[95vw] flex-col gap-4 divide-y md:max-w-7xl md:flex-row md:divide-x md:divide-y-0">
          <div className="flex w-full flex-col justify-center gap-4 py-4 text-center">
            <h3 className="text-xl font-bold">Review</h3>
            <p>Share your thoughts and ratings on the latest movies</p>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 py-4 text-center">
            <h3 className="text-xl font-bold">Share</h3>
            <p>Connect with friends and see their reviews</p>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 py-4 text-center">
            <h3 className="text-xl font-bold">Watch</h3>
            <p>Stream your favorite movies directly on our platform</p>
          </div>
        </div>
      </div>
      <div className="my-4 flex w-screen max-w-7xl flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-accent p-16 px-8">
        <h2 className="max-w-xl text-center text-2xl font-bold text-foreground">
          Join the Brain Rotting Community Today!
        </h2>
        <h3 className="max-w-xl text-center text-xl text-foreground opacity-80">
          Sign up now and start sharing your reviews
        </h3>
        <Link href={"/login"}>
          <div className="my-4 rounded-lg bg-accent px-8 py-4 text-xl font-bold">
            Sign up
          </div>
        </Link>
      </div>
      <div className="w-full max-w-7xl">
        <h2 className="mb-4 text-lg font-medium">Legal Disclaimer</h2>
        <p className="">
          Data provided by TMDb API.{" "}
          <Link href={"/"} className="text-accent">
            rotten-brains.com
          </Link>{" "}
          doesn’t host movies; we only share links. Our site provides links to
          content hosted by third-party sites, over which we have no control. We
          take intellectual property rights seriously. If you believe a third
          party is infringing on your copyright, please submit a DMCA report to
          rottenbrains@proton.me, and we’ll take appropriate action. Premium
          servers are just a scrape of other servers which are not hosted by us.
          You can find more information in our{" "}
          <Link href={"/protected/about"} className="text-accent">
            about page
          </Link>
          .
        </p>
      </div>
      <div className="my-4 flex w-screen max-w-7xl flex-row items-center justify-between gap-8 p-16 px-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <div className="flex flex-col gap-4 text-foreground/80">
            <Link href={"/protected/home"}>Home</Link>
            <Link href={"/protected/explore"}>Explore</Link>
            <Link href={"/protected/create-post"}>Create Post</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Socials</h3>
          <div className="flex flex-col gap-4 text-foreground/80">
            <Link href={"/"}>Discord</Link>
            <Link href={"/"}>Instagram</Link>
            <Link href={"/"}>Telegram</Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <img src="/assets/images/logo.png" alt="" width={200} height={200} />
          <img
            src="/assets/images/logo-text.png"
            alt=""
            className="invert-on-dark"
            width={200}
            height={200}
          />
          <p>© Developed by Gumeq 2024</p>
        </div>
      </div>
    </div>
  );
}
