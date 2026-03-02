import { ExpenseForm } from "../../components/ExpenseForm";
import { ExpenseList } from "../../components/ExpenseList";
import { useExpenses } from "../../hooks/useExpenses";

export const DashboardPage = () => {
    const {expenses, current, updateCurrent, 
        add, update, remove,
        pagination, setCurrentPage, setPageSize, 
        pending, error} = useExpenses();

    return (<>
        <h2>Dashboard</h2>
        <ExpenseForm add={add} update={update} current={current} updateCurrent={updateCurrent} pending={pending} errorApi={error} />
        <ExpenseList 
            expenses={expenses} 
            current={current}
            updateCurrent={updateCurrent}
            pagination={pagination} 
            remove={remove}
            setCurrentPage={setCurrentPage} setPageSize={setPageSize}
            error={error} pending={pending} />
    </>);
}