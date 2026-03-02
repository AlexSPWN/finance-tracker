export const Categories = ["Food", "Transport", "Entertainment", "Other"] as const;

export type Expense = {
    id: string;
    name: string;
    category: string;
    amount: number;
}

export type ExpenseExt = Expense & {adding?: boolean, updating?: boolean, deleting?: boolean};

export type ExpenseFormProps = Omit<Expense, "id" | "amount"> & {
    amount: string | undefined
}

export type ErrorFields = Partial<Record<keyof ExpenseFormProps, string>>
export type TouchedFields = Partial<Record<keyof ExpenseFormProps, boolean>>

export type ExpenseResponse = {
    items: Expense [];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}