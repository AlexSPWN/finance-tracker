import type { Expense, ExpenseExt } from "../types/Expense"
import type { ErrorState, PendingState } from "../types/Operations"
import type { PaginationProp } from "../types/Pagination"
import { PageSizeSelector } from "./common/PageSizeSelector"
import { Pagination } from "./common/Pagination"
import { ExpenseItem } from "./ExpenseItem"

type Props = {
    expenses: ExpenseExt[],
    pagination: PaginationProp,
    remove: (id: string) => void,
    current: Expense | undefined,
    updateCurrent: (expense: Expense) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    pending: PendingState,
    error: ErrorState
}

export const ExpenseList  = ({expenses, pagination, remove, current, updateCurrent, setCurrentPage, setPageSize, pending, error}: Props) => {
    return (
        <div className="flex flex-col grow">
        <PageSizeSelector currentValue={pagination.pageSize} setPageSize={setPageSize} />
        {error.remove && <div style={{ color: 'red', padding: 8, background: '#fee' }}>{error.remove}</div>}
        {pending.load ? <h2>Loading ...</h2> : error.load ? <h2>{error.load}</h2>:
            expenses.length === 0 ? "No expenses yet" :
            <>  
                <div id="tableHeader" className="grid grid-cols-5 h-10 items-center bg-blue-100 rounded-t-md mt-5">
                    <div className="px-1">Date</div>
                    <div className="px-1">Name</div>
                    <div className="px-1">Category</div>
                    <div className="px-1">Amount</div>
                    <div className="px-1">Action</div>
                </div>
                {expenses.map(e => <ExpenseItem key={e.id} expense={e} current={current} updateCurrent={updateCurrent} remove={remove} pending={pending} />)}
            </>
        }
        <Pagination pagination={pagination} goToPage={setCurrentPage} />
        </div>
    );
}