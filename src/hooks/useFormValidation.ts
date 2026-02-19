import { useMemo } from "react";
import type { ErrorFields, ItemForm } from "../types/Item";

export const useFormValidation = (form: ItemForm) => {
    return useMemo(() => {
        const errors: ErrorFields = {};
        const nameLength = form.name.trim().length;

        if(nameLength < 3 || nameLength > 50) {
            errors.name = "Min 3 and Max 50 characters"
        }

        if(form.price !== undefined && (form.price < 0.01 || form.price > 100000)) {
            errors.price = "Min 0.01 and Max 100000"
        }
        const isValid = Object.keys(errors).length === 0;

        return {errors, isValid}
    }, [form.name, form.price])
}