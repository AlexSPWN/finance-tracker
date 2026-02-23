import React, { useState } from "react"
import type { TouchedFields, LoginForm } from "../types/Login"
import { useLoginFormValidation } from "./useLoginFormValidation"

const emptyForm: LoginForm = {
    email: "",
    password: ""
}

export const useLoginForm = () => {
    const [form, setForm] = useState<LoginForm>(emptyForm);
    const {errors, isValid} = useLoginFormValidation(form);
    const [touched, setTouched] = useState<TouchedFields>({});

    const reset = () => {
        setTouched({});
        setForm(emptyForm);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
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
        setTouched({email: true, password: true});
    }

    return {form, errors, isValid, touched, reset, handleChange, handleBlur, handleSubmit }
}