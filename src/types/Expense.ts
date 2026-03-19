export const Categories = ["Food", "Transport", "Entertainment", "Other"] as const;
export const TypeList = ["income", "expense"] as const;
export type ExpType = typeof TypeList[number];
export type Expense = {
    id: string;
    name: string;
    category: string;
    type: ExpType;
    amount: number;
    expDate: string;
    createdAt?: string;
    updatedAt?: string;
}

export type ExpenseExt = Expense & {adding?: boolean, updating?: boolean, deleting?: boolean};

export type ExpenseFormProps = Omit<Expense, 
    "id" | "amount" | "type" | "createdAt" | "updatedAt"> & {
    amount: string | undefined,
    type: ExpType | undefined
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

export type ExpenseQuery = {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}