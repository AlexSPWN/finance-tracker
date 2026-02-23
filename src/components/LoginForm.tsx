import type React from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { normalizeEmail } from "../utils/email";

export const LoginForm = () => {
    const {form, errors, touched, isValid, reset, handleChange, handleBlur, handleSubmit} = useLoginForm();
    const { login, logout, state } = useAuthContext();
    const [authError, setAuthError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const onSubmit = async (e: React.SubmitEvent) => {
        handleSubmit(e);
        setAuthError("");
        if(!isValid) return;
        setIsSubmitting(true);
        try {
            await login(normalizeEmail(form.email), form.password);
            reset();            
            navigate(from, { replace: true });
        } catch (e: unknown) {
            if(e instanceof Error) {
                setAuthError(e.message);
            } else {
                setAuthError("Unknown error");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthError("");
        handleChange(e);
    }

    return (
        <>
        <div>Debug Info - isAuth: {state.isAuthenticated.toString()}; isLoading: {state.isLoading.toString()}; Role: {state.role}</div>
        {state.isAuthenticated ? <button type="button" onClick={logout}>Logout</button> :
        <form onSubmit={onSubmit}>
            <div>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={form.email}
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                </label>
                {touched.email && errors.email && <div>{errors.email}</div>}
            </div>
            <div>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password}
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                </label>
                {touched.password && errors.password && <div>{errors.password}</div>}
            </div>
            <div>
                <button type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Logging in" : "Login"}</button>
            </div>
        </form>
        
        }
        {authError && <div>{authError}</div>}
        </>
    );

}