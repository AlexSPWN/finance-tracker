import { useState } from "react"
import type { RegisterForm, TouchedFields } from "../types/Register"
import { useRegisterFormValidation } from "./useRegisterFormValidation";
import { normalizeEmail } from "../utils/email";

const emptyForm: RegisterForm = {
    email: "",
    password: "",
    repassword: ""
}
export const useRegisterForm = () => {

    const [form, setForm] = useState<RegisterForm>(emptyForm);
    const {errors, isValid, pwdStrength } = useRegisterFormValidation(form);
    const [touched, setTouched] = useState<TouchedFields>({});
    
        const reset = () => {
            setTouched({});
            setForm(emptyForm);
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setForm(prev => ({
                ...prev,
                [name]: name === "email" ? normalizeEmail(value) : value
            }));
        }
    
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setTouched(prev => ({
                ...prev,
                [e.target.name]: true
            }));
        }
    
        const handleSubmit = (e: React.SubmitEvent) => {
            e.preventDefault();
            setTouched({email: true, password: true, repassword: true});
        }
    
        return {form, errors, isValid, pwdStrength, touched, reset, handleChange, handleBlur, handleSubmit }
}