"use client";

import { IUser } from "@/types";
import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface UserContextType {
  user: IUser | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (data) {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.session?.user.id)
          .single();
        if (user) {
          setUser(user);
          setLoading(false);
        }
      } else {
      }
    };
    fetchUser();
  }, [user]);
  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
