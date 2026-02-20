export type AuthState = {
    isAuthenticated: boolean;
    role: string;
    isLoading: boolean;
}
export type AuthAction =
| {type: "login", payload: { isAuthenticated: boolean, role: string, isLoading: boolean }}
| {type: "logout"}