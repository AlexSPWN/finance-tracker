import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export const useAuthContext = () => {
    const authCtx = useContext(AuthContext);
    if(!authCtx) throw new Error("useAuthContext calling out of AuthProvider");
    return authCtx;
}