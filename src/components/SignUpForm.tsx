import { useState } from "react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useLocation, useNavigate } from "react-router";
import { regService } from "../services/regService";

export const SignUpForm = () => {

    const {form, errors, isValid, pwdStrength, touched, 
        reset, handleChange, handleBlur, handleSubmit} = useRegisterForm()
    const [pwdInputType, setPwdInputType] = useState(true);

    const [regError, setRegError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/login";

    const handleToggle = () => {
        setPwdInputType(prev => !prev);
    }

    const onSubmit = async (e: React.SubmitEvent) => {
        if(isSubmitting) return;
        handleSubmit(e);
        setRegError("");
        if(!isValid) return;
        setIsSubmitting(true);
        try {
            const regData = {
                email: form.email,
                password: form.password
            }
            await regService.register(regData);
            reset();            
            navigate(from, { replace: true });
        } catch (e: unknown) {
            if(e instanceof Error) {
                setRegError(e.message);
            } else {
                setRegError("Unknown error");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setRegError("");
            handleChange(e);
    }

    return (
        <>
            <form onSubmit={onSubmit} 
            className="rounded-xl bg-blue-50 p-5  w-1/3 max-w-lg"
            >
                <div className="mt-2 text-left">
                    <label className="flex flex-col">
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={form.email}
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
                    <div className="flex">
                        <input 
                            type={pwdInputType ? "password" : "text"}
                            name="password"
                            value={form.password}
                            className="bg-gray-50 grow rounded py-1 px-2 focus:outline-none focus:bg-white"
                            onBlur={handleBlur}
                            onChange={onChange}
                        />
                        <button type="button" onClick={handleToggle}>{pwdInputType ? "Show" : "Hide"}</button>
                    </div>
                    </label>
                     <div className="text-red-500 text-sm ps-1">
                        {touched.password && errors.password && <div>{errors.password}</div>}
                     </div>                    
                </div>
                <div className="mt-2 text-left">
                    <label className="flex flex-col">
                    Confirm password:
                    <input 
                        type="password" 
                        name="repassword"
                        value={form.repassword}
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-white"
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                    </label>
                     <div className="text-red-500 text-sm ps-1">
                        {touched.repassword && errors.repassword && <div>{errors.repassword}</div>}
                     </div>
                </div>
                <div className="flex justify-center mt-5 space-x-2">
                    <button 
                        type="submit" 
                        disabled={!isValid || isSubmitting}
                        className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-10 py-2 disabled:bg-gray-200 disabled:text-gray-500"
                    >{isSubmitting ? "Registering" : "Register"}</button>
                </div>
            </form>
            {regError && <div>{regError}</div>}
            {form.password.length > 0 && 
            <div>
                <div>Min lenght: {pwdStrength?.rules.minLength ? "Ok" : "No"}</div>
                <div>Lowercase: {pwdStrength?.rules.hasLower ? "Ok" : "No"}</div>
                <div>Uppercase: {pwdStrength?.rules.hasUpper ? "Ok" : "No"}</div>
                <div>Number: {pwdStrength?.rules.hasNumber ? "Ok" : "No"}</div>
                <div>Special: {pwdStrength?.rules.hasSpecial ? "Ok" : "No"}</div>
                <div>Password strength: {pwdStrength?.strength}</div>
                <div>Points: {pwdStrength?.points}</div>
            </div>}
        </>
    );
}