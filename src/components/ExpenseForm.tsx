import { useState } from "react";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { Categories, type Expense, type ExpenseFormProps } from "../types/Expense"
import type { ErrorState, PendingState } from "../types/Operations";
import { Modal } from "./common/Modal";
import { ConfirmDialog } from "./common/ConfirmDialog";


type Props = {
    add: (expense: ExpenseFormProps) => void;
    update: (expense: Expense) => void;
    current: Expense | undefined;
    updateCurrent: (expense: Expense | undefined) => void;
    pending: PendingState;
    errorApi: ErrorState;
}
export const ExpenseForm = ({add, update, current, updateCurrent, pending, errorApi}: Props) => {

    const {form, reset,
        handleSubmit, handleBlur, handleChange, handleClear,
        errors, touched, isValid
    } = useExpenseForm({current, updateCurrent});

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<Expense | null>(null);
    
    const onSubmit = async (e: React.SubmitEvent) => {
        const data = handleSubmit(e);
        if(!data) return;
        if (current) {
            setPendingUpdateData({id: current.id, name: data.name, amount: Number(data.amount!), category: data.category});
            setShowConfirm(true);
        } else {
            add(data);
            reset();
        }
    }

    const confirmUpdate = () => {
        if (!pendingUpdateData) return;
        update(pendingUpdateData); // call hook update
        reset(); // reset form after update
        setShowConfirm(false);
        setPendingUpdateData(null);
    };

    const cancelUpdate = () => {
        setShowConfirm(false);
        setPendingUpdateData(null);
    };

    return (
        <>
        {showConfirm && (
                    <Modal onClose={cancelUpdate}>
                        <ConfirmDialog
                            title="Update expense"
                            message="Are you sure you want to update this expense?"
                            confirmButtonName="Update"
                            onConfirm={confirmUpdate}
                            onCancel={cancelUpdate}
                        />
                    </Modal>
        )}
        <form onSubmit={onSubmit}>
            <div>
                <label>
                    Name:
                    <input 
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {touched.name && errors.name && <div>{errors.name}</div>}
                </label>
            </div>
            <div>
                <label>
                    Amount:
                    <input 
                        type="text"
                        name="amount"
                        inputMode="decimal"
                        autoComplete="off"
                        value={form.amount ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {touched.amount && errors.amount && <div>{errors.amount}</div>}
                </label>
            </div>
            <div>
                <label>
                    Category:
                    <select 
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <option value={""}></option>
                        {Categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {touched.category && errors.category && <div>{errors.category}</div>}
                </label>
            </div>
            <div>
                <button 
                    type="submit" 
                    disabled={!isValid || pending.add || pending.update}
                >
                    {current ? pending.update ? "Updating" : "Update" : pending.add ? "Saving" : "Save" }
                </button>
                {current && <button type="button" onClick={handleClear}>Clear</button>}
                {errorApi.add && <h3>{errorApi.add}</h3>}
                {errorApi.update && <h3>{errorApi.update}</h3>}
            </div>
        </form>
        </>
    );
}