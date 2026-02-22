import type { ReactNode } from "react"
import type { Role } from "../types/UserProfile";
import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate, useLocation } from "react-router";

type Props = {
    children: ReactNode;
    allowedRoles: Role[];
}
export const RoleProtectedRoute = ({children, allowedRoles}: Props) => {
    const {state} = useAuthContext();
    const location = useLocation();

    if(state.isLoading) {
        return <h2>Loading ...</h2>;
    }

    if(!state.isAuthenticated || !state.role) {
        return <Navigate to="/login" replace state={{from: location}} />
    }        
    
    if(!allowedRoles.includes(state.role)) {
        return <Navigate to="/access-denied" replace state={{from: location}} />
    }

    return children;

}