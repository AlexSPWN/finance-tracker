import { ExpenseList } from "../../components/ExpenseList";
import { useExpenses } from "../../hooks/useExpenses";

export const DashboardPage = () => {
    const {expenses, pagination, remove, setCurrentPage, setPageSize, pending, error} = useExpenses();
    return (<>
        <h2>Dashboard</h2>
        <ExpenseList 
            expenses={expenses} 
            pagination={pagination} 
            remove={remove}
            setCurrentPage={setCurrentPage} setPageSize={setPageSize}
            error={error} pending={pending} />
    </>);
}