export default function VersionDisplay() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA || "0.171";

  return <p className="">Version: {version.slice(-5)}</p>;
}
