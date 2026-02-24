import { useMemo } from "react"
import type { ErrorFields, RegisterForm } from "../types/Register"
import { isValidEmail } from "../utils/email";
import { checkPassword, type PwdStrength } from "../utils/password";

export const useRegisterFormValidation = (form: RegisterForm) => {
    return useMemo(() => {
        const errors: ErrorFields = {};
        let pwdStrength: PwdStrength | undefined = undefined;

        if(!isValidEmail(form.email)) {
            errors.email = "Wrong email format";
        }

        if(!form.password || form.password.length === 0 ) {
            errors.password = "Password is required";
        } else if (form.password !== form.password.trim()) {
            errors.password = "Password cannot begin or end with a space";
        }
        else {
            pwdStrength = checkPassword(form.password);
            if(!pwdStrength.isValid) {
                errors.password = "Password does not meet security policies";
            }
        }

        if(form.repassword && form.password !== form.repassword) {
            errors.repassword = "Passwords do not match";
        }
        
        const isValid = Object.keys(errors).length === 0;

        return { errors, isValid, pwdStrength }
    }, [form.email, form.password, form.repassword]);
}