import { addApi, deleteApi, getAllApi, getAllNewApi, updateApi } from "../api/expenseApi";
import type { Expense, ExpenseFormProps, ExpenseQuery, ExpenseResponse } from "../types/Expense";


export const expenseService = {
    async getAll(page?: number, pageSize?: number, signal?: AbortSignal): Promise<ExpenseResponse> {
        const res = await getAllApi(page, pageSize, signal);
        if (!res) {
            throw new Error("No data received");
        }
        return res;
    },
    async getAllNew(expQuery?: ExpenseQuery, signal?: AbortSignal): Promise<ExpenseResponse> {
        const res = await getAllNewApi(expQuery, signal);
        if (!res) {
            throw new Error("No data received");
        }
        return res;
    },
    async add(expense: ExpenseFormProps): Promise<Expense> {
        const res = await addApi(expense);
        if(!res) {
            throw new Error("No expense created");
        }
        return res
    },
    async update(id: string, expense: ExpenseFormProps): Promise<void> {
        await updateApi(id, expense);
    },
    async remove(id: string): Promise<void> {
        await deleteApi(id);
    }
}