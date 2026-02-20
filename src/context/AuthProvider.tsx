import { useEffect, useReducer, type ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import { AuthReducer } from "./AuthReducer"
import { apiFetch, setAccessToken } from "../api/clientApi"
import { loginApi, logoutApi } from "../api/authApi"
import { parseJwt } from "../utils/parseJwt"

type AuthProviderProps = {
    children: ReactNode
}

export const AuthProvider = ({children}: AuthProviderProps) => {

    const [state, dispatch] = useReducer(AuthReducer, {
        isAuthenticated: false,
        role: "",
        isLoading: true
    });

    useEffect(() => {
        const init = async () => {
            try {
                const data = await apiFetch<{ accessToken: string }>("/auth/refresh", {
                    method: "POST"
                }, false);

                if (data?.accessToken) {
                    setAccessToken(data.accessToken);
                    dispatch({
                        type: "login",
                        payload: {
                            isAuthenticated: true,
                            role: parseJwt(data.accessToken).role || "",
                            isLoading: false
                        }
                    });
                }
            } catch {
                dispatch({ type: "logout" });
            }
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginApi(email, password);
        if(!data) throw new Error("Login failed");
        setAccessToken(data.accessToken);

        dispatch({
            type: "login",
            payload: {
                isAuthenticated: true,
                role: parseJwt(data.accessToken).role || "",
                isLoading: false
            }
        });
    };

    const logout = async () => {
        await logoutApi();
        setAccessToken(null);
        dispatch({ type: "logout" });
    };

    return (
        <AuthContext.Provider value={{state, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}