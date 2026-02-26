import type { Expense } from "../types/Expense"
import type { ErrorState, PendingState } from "../types/Operations"
import type { PaginationProp } from "../types/Pagination"
import { PageSizeSelector } from "./common/PageSizeSelector"
import { Pagination } from "./common/Pagination"
import { ExpenseItem } from "./ExpenseItem"

type Props = {
    expenses: Expense[],
    pagination: PaginationProp,
    remove: (id: string) => void,
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    pending: PendingState,
    error: ErrorState
}

export const ExpenseList  = ({expenses, pagination, remove, setCurrentPage, setPageSize, pending, error}: Props) => {
    return (
        <>
        <PageSizeSelector currentValue={pagination.pageSize} setPageSize={setPageSize} />
        {pending.load ? <h2>Loading ...</h2> : error.load ? <h2>{error.load}</h2>:
            expenses.length === 0 ? "No expenses yet" :
            expenses.map(e => <ExpenseItem key={e.id} expense={e} remove={remove} pending={pending} />)
        }
        <Pagination pagination={pagination} goToPage={setCurrentPage} />
        </>
    );
}