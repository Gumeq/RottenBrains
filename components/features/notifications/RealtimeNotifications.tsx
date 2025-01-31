"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/UserContext";
import { createClient } from "@/lib/supabase/client";

const NotificationButton = () => {
  const [hasUnread, setHasUnread] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user.id;

    const fetchUnreadNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("read")
        .eq("user_id", userId)
        .eq("read", false);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setHasUnread(data && data.length > 0);
    };

    const fetchInitialDataAndSubscribe = async () => {
      await fetchUnreadNotifications();

      const channel = supabase
        .channel(`public:notifications:user_id=eq.${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
          },
          (payload) => {
            if (payload.new.user_id === userId) {
              setHasUnread(true);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
          },
          (payload) => {
            if (payload.new.user_id === userId) {
              fetchUnreadNotifications();
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchInitialDataAndSubscribe();
  }, [user, supabase]);

  const handleClick = () => {
    router.push("/protected/notifications");
  };

  return (
    <button onClick={handleClick} className="pointer relative">
      <img
        src={`${
          pathname.includes("/protected/notifications")
            ? "/assets/icons/notification-solid.svg"
            : "/assets/icons/notification-outline.svg"
        }`}
        alt="Notification Bell"
        width={25}
        height={25}
        className="invert-on-dark max-h-[25px] max-w-[25px]"
      />
      {hasUnread && (
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent"></span>
      )}
    </button>
  );
};

export default NotificationButton;
