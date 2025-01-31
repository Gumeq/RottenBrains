"use client";
import { oAuthSignIn } from "@/lib/server/OAuthSignIn";
import { useUser } from "@/hooks/UserContext";
import { Provider } from "@supabase/supabase-js";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon: string;
};

export function OAuthButton() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "google",
      displayName: "Google",
      icon: "/assets/icons/google.svg",
    },
    {
      name: "discord",
      displayName: "Discord",
      icon: "/assets/icons/discord.svg",
    },
  ];

  const { refreshUser } = useUser();

  return (
    <>
      {oAuthProviders.map((provider) => (
        <button
          className="outline-solid mb-2 flex items-center justify-center gap-4 rounded-md px-4 py-2 text-foreground outline outline-2 outline-accent"
          onClick={async () => {
            await oAuthSignIn(provider.name);
            await refreshUser();
          }}
          type={"button"}
        >
          {provider.icon && (
            <img
              src={provider.icon}
              alt={""}
              width={15}
              height={15}
              className="invert-on-dark"
            ></img>
          )}

          <p>Login with {provider.displayName}</p>
        </button>
      ))}
    </>
  );
}
