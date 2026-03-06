import type { Role } from "../types/UserProfile";

export type AuthState = {
    isAuthenticated: boolean;
    userEmail: string | undefined;
    role: Role | undefined;
    isLoading: boolean;
}
export type AuthAction =
| {type: "login", payload: { isAuthenticated: boolean, userEmail: string | undefined, role: Role | undefined, isLoading: boolean }}
| {type: "logout"}