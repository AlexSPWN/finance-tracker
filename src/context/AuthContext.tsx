import { createContext } from "react";
import type { AuthState } from "./AuthTypes"

type AuthContextValue = {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)