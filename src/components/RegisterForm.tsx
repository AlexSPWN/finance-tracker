import { useState } from "react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useLocation, useNavigate } from "react-router";
import { regService } from "../services/regService";

export const RegisterForm = () => {

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
                        type={pwdInputType ? "password" : "text"}
                        name="password"
                        value={form.password}
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                    <button type="button" onClick={handleToggle}>{pwdInputType ? "Show" : "Hide"}</button>
                    </label>
                    {touched.password && errors.password && <div>{errors.password}</div>}
                    
                </div>
                <div>
                    <label>
                    Confirm password:
                    <input 
                        type="password" 
                        name="repassword"
                        value={form.repassword}
                        onBlur={handleBlur}
                        onChange={onChange}
                    />
                    </label>
                    {touched.repassword && errors.repassword && <div>{errors.repassword}</div>}
                </div>
                <div>
                    <button type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Registering" : "Register"}</button>
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