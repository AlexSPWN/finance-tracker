import type { AuthAction, AuthState } from "./AuthTypes";

export const AuthReducer = (state: AuthState, action: AuthAction):AuthState => {
    switch(action.type) {
        case "login":
            return {
                isAuthenticated: action.payload.isAuthenticated,
                role: action.payload.role,
                isLoading: action.payload.isLoading
            }
        case "logout":
            return {
                isAuthenticated: false,
                role: undefined,
                isLoading: false
            }
        default:
            return state;
    }
}