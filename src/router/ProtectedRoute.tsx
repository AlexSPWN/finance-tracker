import type { ReactNode } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { Navigate, useLocation } from "react-router"

type Props = {
    children: ReactNode
}

export const ProtectedRoute = ({children}: Props) => {
    const {state} = useAuthContext();
    const location = useLocation();
    if(state.isLoading) {
        return <h2>Loading ...</h2>;
    }
    if(!state.isAuthenticated) {
        return <Navigate to="/login" replace state={{from: location}} />
    }
    return children;
}