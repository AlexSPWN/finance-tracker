import { cleanDeviceId, getDeviceId } from "../utils/deviceId";
import { apiFetch } from "./clientApi";

type LoginResponse = {
    accessToken: string;
}

export const loginApi = async (email: string, password: string) => {
    const deviceId = getDeviceId();

    return apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password, deviceId})
    }, false);
};

export const logoutApi = async () => {
    cleanDeviceId();
    await apiFetch("/auth/logout", {
        method: "POST"
    }, false);
}

export const registerApi = async (email: string, password: string) => {
    await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password})
    }, false);
}