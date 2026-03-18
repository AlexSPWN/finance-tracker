import type { Expense, ExpenseFormProps, ExpenseQuery, ExpenseResponse } from "../types/Expense";
import { apiFetch } from "./clientApi"

const apiURL = "/api/Expenses";

export const getAllApi = async (page?: number, pageSize?: number, signal?: AbortSignal) => {
    const query = page && pageSize ? `?Page=${page}&PageSize=${pageSize}`
     : page ? `?Page=${page}` 
     : pageSize ? `?PageSize=${pageSize}` 
     : "";

    return await apiFetch<ExpenseResponse>(`${apiURL}${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal
    })
}

export const getAllNewApi = async (expQuery?: ExpenseQuery, signal?: AbortSignal) => {
    let query ="";
    if(expQuery) {
        query = Object.entries(expQuery).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
        if(query) query = "?" + query;
    }
    //console.log(query);
    return await apiFetch<ExpenseResponse>(`${apiURL}${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal
    })
}

export const addApi = async (expense: ExpenseFormProps) => {
    return await apiFetch<Expense>(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    })
}

export const updateApi = async (id: string, expense: ExpenseFormProps) => {
    return await apiFetch(`${apiURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    })
}

export const deleteApi = async (id: string) => {
    return await apiFetch(`${apiURL}/${id}`, {
        method: "DELETE",
    })
}