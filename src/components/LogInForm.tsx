import type React from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { normalizeEmail } from "../utils/email";

export const LogInForm = () => {
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
        {/* <div>Debug Info - isAuth: {state.isAuthenticated.toString()}; isLoading: {state.isLoading.toString()}; Role: {state.role}</div> */}
        {state.isAuthenticated ? <button type="button" onClick={logout}>Logout</button> :
        <form onSubmit={onSubmit}
        className="rounded-xl bg-blue-50 p-5 w-1/3 max-w-lg"
        >
            <div className="mt-2 text-left">
                <label className="flex flex-col">
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={form.email}
                        placeholder="john@mail.com"
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-white"
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                </label>
                <div className="text-red-500 text-sm ps-1">
                    {touched.email && errors.email && <div>{errors.email}</div>}
                </div>
            </div>
            <div className="mt-2 text-left">
                <label className="flex flex-col">
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password}
                        placeholder="Please type your password"
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-white"
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                </label>
                <div className="text-red-500 text-sm ps-1">
                    {touched.password && errors.password && <div>{errors.password}</div>}
                </div>
            </div>
            <div className="flex justify-center mt-5 space-x-2">
                <button 
                    type="submit" 
                    disabled={!isValid || isSubmitting}
                    className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-10 py-2 disabled:bg-gray-200 disabled:text-gray-500"
                >
                {isSubmitting ? "Logging in" : "Log in"}
                </button>
            </div>
        </form>
        
        }
        {authError && <div>{authError}</div>}
        </>
    );

}