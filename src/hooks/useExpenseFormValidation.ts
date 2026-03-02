import { useMemo } from "react";
import type { ErrorFields, ExpenseFormProps } from "../types/Expense";

export const useExpenseFormValidation = (form: ExpenseFormProps) => {
    return useMemo(() => {
        const errors: ErrorFields = {};
        const nameLength = form.name.trim().length;

        if(nameLength < 3 || nameLength > 50) {
            errors.name = "Min 3 and Max 50 characters"
        }

        if (form.amount === undefined || form.amount === "") {
            errors.amount = "Amount is required";
        } else {
            // ignore incomplete decimal like "12."
            if (form.amount.endsWith(".")) {
                // do nothing (no error yet)
            } else if (
                !/^\d+(\.\d{1,2})?$/.test(form.amount) ||
                Number(form.amount) < 0.01 ||
                Number(form.amount) > 100000
            ) {
                errors.amount = "Min 0.01 and Max 100000";
            }
        }

        if(!form.category) {
            errors.category = "Category is required"
        }
        const isValid = Object.keys(errors).length === 0;

        return {errors, isValid}
    }, [form.name, form.amount, form.category])
}