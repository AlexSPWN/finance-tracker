export type Expense = {
    id: string;
    name: string;
    category: string;
    amount: number;
}

export type ExpenseFormProps = Omit<Expense, "id">

export type ExpenseResponse = {
    items: Expense [];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}