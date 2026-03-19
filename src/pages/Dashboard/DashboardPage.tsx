import { ExpenseChart } from "../../components/ExpenseChart";
import { ExpenseForm } from "../../components/ExpenseForm";
import { ExpenseList } from "../../components/ExpenseList";
import { useExpenses } from "../../hooks/useExpenses";

export const DashboardPage = () => {
    const {expenses, current, updateCurrent, 
        add, update, remove,
        pagination, setCurrentPage, setPageSize, 
        query, setSortBy, setSearch,
        // setSortOrder,
        pending, error} = useExpenses();

    return (<div className="flex flex-col items-start grow w-full px-1">
        <h2 className="mb-5">Dashboard</h2>
        <div className="w-full">
            <div className="flex gap-4 w-full">
                <ExpenseForm add={add} update={update} current={current} updateCurrent={updateCurrent} pending={pending} errorApi={error} />
                <ExpenseChart />
            </div>
            <div className="mt-5">
                <ExpenseList 
                    expenses={expenses} 
                    current={current}
                    updateCurrent={updateCurrent}
                    pagination={pagination} 
                    remove={remove}
                    setCurrentPage={setCurrentPage} setPageSize={setPageSize}
                    query={query} setSortBy={setSortBy} setSearch={setSearch}
                    error={error} pending={pending} />
            </div>
        </div>
    </div>);
}