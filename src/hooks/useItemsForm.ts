import React, { useEffect, useState } from "react";
import type { TouchedFields, Item, ItemForm } from "../types/Item"
import { useFormValidation } from "./useFormValidation";

const emptyForm: ItemForm = {
    name: "",
    price: undefined
}
type Props = {
    current: Item | undefined;
    //add: (item: ItemForm) => void;
    //update: (item: Item) => void;
    setCurrent: (item: Item | undefined) => void;
}
export const useItemsForm = ({current, setCurrent}: Props) => {

    const [form, setForm] = useState<ItemForm>(emptyForm);
    const {errors, isValid} = useFormValidation(form);
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        const initForm = () => {
            if(current) {
                setForm({name: current.name, price: current.price});
            } else {
                setForm(emptyForm);
            }
        };
        initForm();
    }, [current]);

    /* const save = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({name: true, price: true});
        if(!isValid) return;
        if(current) {
            update({id: current.id, name: form.name, price: form.price!})
        } else {
            add(form)
        }
        setTouched({});
        setForm(emptyForm);
    } */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, price: true });
        if (!isValid) return null;
        return form;
    };

    const reset = () => {
        setTouched({});
        setForm(emptyForm);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "price" ? value === "" ? undefined : Number(value ?? 0) : value
        }))
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({
            ...prev,
            [e.target.name]: true
        }))
    }

    const handleClear = () => {
        setCurrent(undefined);
    }

    return {form, handleSubmit, reset, handleChange, handleBlur, handleClear, errors, isValid, touched}
}