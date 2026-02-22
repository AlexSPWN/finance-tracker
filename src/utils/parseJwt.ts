import type { Role } from "../types/UserProfile";

type JWT = {
    nameid?: string;
    email?: string;
    role?: Role;
    exp?: number;
    iat?: number;
    nbf?: number;
}
export const parseJwt = (token: string): JWT => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
       
        return JSON.parse(jsonPayload);
    } catch {
        return {};
    }
}