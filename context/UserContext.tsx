"use client";

import { IUser } from "@/types";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
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
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const user = await getCurrentUser();
			setUser(user.user);
			setLoading(false);
		};

		fetchUser();
	}, []);

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
