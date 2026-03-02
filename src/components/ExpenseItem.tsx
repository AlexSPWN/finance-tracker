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
        <div style={{
              opacity: expense.deleting ? 0.5 : 1,
              textDecoration: expense.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }} >
            {expense.id} | {expense.name} | {expense.category} | {expense.amount} 
            {expense.adding && <div>Adding...</div>}
            {expense.updating && <div>Updating...</div>}
        </div>
        {!expense.deleting && 
            <button 
                type="button" 
                disabled={pending.update || (current && current.id === expense.id)} 
                onClick={() => updateCurrent(expense)}>
                Edit
            </button>
        }
        <button 
            type="button" 
            disabled={expense.deleting} 
            onClick={handleDelete}>{expense.deleting ? "Deleting" : "Delete" } 
        </button>
    </>);
});