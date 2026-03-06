import { useMemo } from "react"
import type { ErrorFields, LoginForm } from "../types/Login";
import { isValidEmail } from "../utils/email";

export const useLoginFormValidation = (form: LoginForm) => {
    return useMemo(() => {
        const errors: ErrorFields = {};

        if(!isValidEmail(form.email)) {
            errors.email = "Wrong email format";
        }

        if(!form.password || form.password.length === 0 ) {
            errors.password = "Password is required";
        }
        
        const isValid = Object.keys(errors).length === 0;

        return {errors, isValid }
    }, [form.email, form.password]);
}