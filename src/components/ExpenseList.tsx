import type { Expense, ExpenseExt, ExpenseQuery } from "../types/Expense"
import type { ErrorState, PendingState } from "../types/Operations"
import type { PaginationProp } from "../types/Pagination"
import { PageSizeSelector } from "./common/PageSizeSelector"
import { Pagination } from "./common/Pagination"
import { ExpenseItem } from "./ExpenseItem"

import "./ExpenseList.css";

type Props = {
    expenses: ExpenseExt[],
    pagination: PaginationProp,
    remove: (id: string) => void,
    current: Expense | undefined,
    updateCurrent: (expense: Expense) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    query: ExpenseQuery;
    setSortBy: (sortBy?: string) => void;
    //setSortOrder: (sortOrder?: "asc" | "desc" ) => void;
    pending: PendingState,
    error: ErrorState
}
export const ExpenseList  = ({expenses, pagination, remove, current, updateCurrent, setCurrentPage, setPageSize, query, setSortBy, pending, error}: Props) => {
     const columns = [
        {label: "Date", field: "expDate", sortable: true},
        {label: "Name", field: "name", sortable: false},
        {label: "Category", field: "category", sortable: false},
        {label: "Amount", field: "amount", sortable: true},
        {label: "Action", field: undefined, sortable: false}
    ];

    return (
        <div className="flex flex-col grow">
            {/* <div>
                {Object.entries(query).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
            </div> */}
        <PageSizeSelector currentValue={pagination.pageSize} setPageSize={setPageSize} />
        {error.remove && <div style={{ color: 'red', padding: 8, background: '#fee' }}>{error.remove}</div>}
        {pending.load ? <h2>Loading ...</h2> : error.load ? <h2>{error.load}</h2>:
            expenses.length === 0 ? "No expenses yet" :
            <>  
                <div 
                    id="tableHeader" 
                    className="grid grid-cols-5 h-10 items-center bg-blue-100 rounded-t-md mt-5"
                >
                    {columns.map(c => {
                        const arrIconClass = c.sortable ? 
                                    c.field === query.sortBy && query.sortOrder === "asc" ? "up" :
                                    c.field === query.sortBy && query.sortOrder === "desc" ? "down" : 
                                    "default" 
                                : "";
                        return (
                            <div 
                                key={c.label} 
                                className={"flex justify-between ps-5 pe-10 font-bold " + (c.sortable ? 'cursor-pointer' : '')}
                                onClick={() => {
                                    if(c.sortable) return setSortBy(c.field ?? "")
                                }}
                            >
                                <span>{c.label}</span>
                                <span className={arrIconClass}></span>
                            </div>
                        )
                    })}
                </div>
                {expenses.map(e => <ExpenseItem key={e.id} expense={e} current={current} updateCurrent={updateCurrent} remove={remove} pending={pending} />)}
            </>
        }
        <Pagination pagination={pagination} goToPage={setCurrentPage} />
        </div>
    );
}