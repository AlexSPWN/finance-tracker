import { memo, useState } from "react";
import type { Expense, ExpenseExt } from "../types/Expense"
import type { PendingState } from "../types/Operations"
import { Modal } from "./common/Modal";
import { ConfirmDialog } from "./common/ConfirmDialog";

type Props = {
    expense: ExpenseExt,
    current: Expense | undefined,
    updateCurrent: (expense: Expense) => void;
    remove: (id: string) => void;
    pending: PendingState,
}
export const ExpenseItem = memo(({expense, current, updateCurrent, remove, pending}: Props) => {

    const [showDialog, setShowDialog] = useState(false);
    
    const handleDelete = () => {
        setShowDialog(true);
    }

    const confirmDelete = () => {
        remove(expense.id);
        setShowDialog(false);
    }
        
    return (<>
        {showDialog && (
            <Modal onClose={() => setShowDialog(false)}>
                <ConfirmDialog 
                    title="Delete expense"
                    message="Are you sure?"
                    confirmButtonName="Delete"
                    onConfirm={confirmDelete}
                    onCancel={()=> setShowDialog(false)}
                />
            </Modal>
        )}
        <div className="even:bg-gray-50" style={{
              opacity: expense.deleting ? 0.5 : 1,
              textDecoration: expense.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }} >
            <div className="grid grid-cols-5 items-center py-2">
                <div className="px-1">
                    {new Date(expense.expDate).toLocaleDateString()}
                </div>
                <div className="px-1">
                    {expense.name}
                </div>
                <div className="px-1">
                    {expense.category}
                </div>
                <div className="px-1">
                    {expense.amount} 
                </div>
                <div className="px-1">
                {!expense.deleting && 
                    <button 
                        type="button" 
                        disabled={pending.update || (current && current.id === expense.id)} 
                        onClick={() => updateCurrent(expense)}
                        className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-4 py-2 me-1 disabled:bg-gray-200 disabled:text-gray-500"
                    >
                        Edit
                    </button>
                }
                <button 
                    type="button" 
                    disabled={expense.deleting} 
                    onClick={handleDelete}
                    className="bg-[#eb7895] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-4 py-2 me-1 disabled:bg-gray-200 disabled:text-gray-500"
                >
                    {expense.deleting ? "Deleting" : "Delete" }   
                </button>
                {expense.adding && <div>Adding...</div>}
                {expense.updating && <div>Updating...</div>}
                </div>
            </div>            
        </div>        
    </>);
});