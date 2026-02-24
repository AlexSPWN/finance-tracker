import type { RegisterForm } from "../types/Register";
import { registerApi } from "../api/authApi";

export const regService = {
    async register(regData: Omit<RegisterForm, "repassword">): Promise<void> {
        await registerApi(regData.email, regData.password)
    }
}