import { memo } from "react";
import type { Expense } from "../types/Expense"
import type { PendingState } from "../types/Operations"

type Props = {
    expense: Expense,
    pending: PendingState
    remove: (id: string) => void;
}
export const ExpenseItem = memo(({expense, remove, pending}: Props) => {
    return (<>
        <div>{expense.name} | {expense.category} | {expense.amount}</div>
        <button type="button" disabled={pending.remove} onClick={() => remove(expense.id)}>Delete</button>
    </>);
});