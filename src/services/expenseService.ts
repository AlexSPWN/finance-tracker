import { addApi, deleteApi, getAllApi, updateApi } from "../api/expenseApi";
import type { Expense, ExpenseFormProps, ExpenseResponse } from "../types/Expense";


export const expenseService = {
    async getAll(page?: number, pageSize?: number, signal?: AbortSignal): Promise<ExpenseResponse> {
        const res = await getAllApi(page, pageSize, signal);
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