import { useEffect, useState } from "react"
import type { Expense, TouchedFields, ExpenseFormProps } from "../types/Expense"
import { useExpenseFormValidation } from "./useExpenseFormValidation";

const emptyForm: ExpenseFormProps = {
    name: "",
    category: "",
    amount: undefined
}
type Props = {
    current: Expense | undefined;
    updateCurrent: (expense: Expense | undefined) => void;
}
export const useExpenseForm = ({current, updateCurrent}: Props) => {
    const [form, setForm] = useState<ExpenseFormProps>(emptyForm);
    
    useEffect(() => {
        const initForm = () => {
            if(current) {
                setForm({
                    name: current.name,
                    category: current.category,
                    amount: current.amount.toString()
                });
            } else {
                setForm(emptyForm);
            }
        };
        initForm();
    }, [current]);

    const {errors, isValid} = useExpenseFormValidation(form);
    const [touched, setTouched] = useState<TouchedFields>({});

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setTouched({
            name: true,
            category: true,
            amount: true
        });
        if(!isValid) return null;
        return form;
    }

    const reset = () => {
        setTouched({});
        setForm(emptyForm);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if(name == "amount") {
            if(value === "") {
                setForm(prev => ({
                    ...prev,
                    amount: undefined
                }));
                return;
            }
            if(!/^\d*\.?\d{0,2}$/.test(value)) {
                return;
            }

            setForm(prev => ({
                ...prev,
                amount: value
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "amount") {
            if (!value) return;
            const num = Number(value);
            if (isNaN(num)) return;
            const formatted = num.toFixed(2);
            setForm(prev => ({
                ...prev,
                amount: formatted
            }));            
        }

        setTouched(prev => ({
            ...prev,
            [name] : true
        }));
    }

    const handleClear = () => {
        reset();
        updateCurrent(undefined);
    }

    return {form, reset, 
        handleSubmit, handleChange, handleBlur, handleClear,
        errors, touched, isValid}
}