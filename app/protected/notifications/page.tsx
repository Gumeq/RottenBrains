"use client";

import NotificationCard from "@/components/features/notifications/NotificationCard";
import { useUser } from "@/hooks/UserContext";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
					*, 
					users:from_user_id (*),
					post_id:posts (*),
					comment_id:comments(*)
				`,
        )
        .eq("user_id", userId)
        .limit(25)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }
      setIsLoading(false);
    };

    fetchNotifications();
  }, [userId, supabase]);

  useEffect(() => {
    if (notifications.length > 0 && userId) {
      const markAllAsRead = async () => {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId)
          .eq("read", false);

        if (error) {
          console.error("Error marking notifications as read:", error);
        }
      };

      markAllAsRead();
    }
  }, [notifications, userId, supabase]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );
  const readNotifications = notifications.filter(
    (notification) => notification.read,
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-screen items-center justify-center"></div>
    );
  }

  return (
    <div className="mx-auto w-screen max-w-xl p-2">
      {unreadNotifications.length > 0 && (
        <div className="mb-2">
          <h2 className="p-2 text-lg font-bold">New</h2>
          <ul className="flex flex-col gap-1">
            {unreadNotifications.map((notification) => (
              <li key={notification.id}>
                <NotificationCard notification={notification} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="p-2 text-lg font-bold">Older</h2>
        <ul className="flex flex-col gap-1">
          {readNotifications.map((notification) => (
            <li key={notification.id}>
              <NotificationCard notification={notification} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;
