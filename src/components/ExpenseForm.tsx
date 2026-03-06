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
            setPendingUpdateData({id: current.id, name: data.name, amount: Number(data.amount!), category: data.category, type: data.type!, expDate: data.expDate});
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
        <form onSubmit={onSubmit} className="rounded-xl bg-blue-50 p-5 w-1/3 min-w-100">
            <div>
                <h2>{current ? "Update expense": "Add expense"}</h2>
            </div>
            <div className="mt-2">
                <label className="flex flex-col text-left">
                    Name:
                    <input 
                        type="text"
                        name="name"
                        value={form.name}
                        placeholder="Buying products"
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-white"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="text-red-500 text-sm ps-1">
                        {touched.name && errors.name && <div>{errors.name}</div>}
                    </div>
                </label>
            </div>
            <div className="mt-2">
                <label className="flex flex-col text-left">
                    Amount:
                    <input 
                        type="text"
                        name="amount"
                        inputMode="decimal"
                        autoComplete="off"
                        value={form.amount ?? ""}
                        placeholder="99.99"
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-gray-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="text-red-500 text-sm ps-1">
                        {touched.amount && errors.amount && <div>{errors.amount}</div>}
                    </div>
                </label>
            </div>
            <div className="flex flex-col items-start mt-2">
                Type: 
                <label className="text-left px-2">
                    <input 
                        type="radio"
                        name="type"
                        value="income"
                        checked={form.type === "income"}
                        className="bg-gray-50 rounded me-2 py-1 px-2 focus:outline-none focus:bg-gray-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    Income
                </label>
                <label className="text-left px-2">
                    <input 
                        type="radio"
                        name="type"
                        value="expense"
                        checked={form.type === "expense"}
                        className="bg-gray-50 rounded me-2 px-2 focus:outline-none focus:bg-gray-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    Expense
                </label>
                <div className="text-red-500 text-sm ps-1">
                    {touched.type && errors.type && <div>{errors.type}</div>}
                </div>
            </div>
            <div className="mt-2">
                <label className="flex flex-col text-left">
                    Category:
                    <select 
                        name="category"
                        value={form.category}
                        className="bg-gray-50 rounded py-1.5 px-2 focus:outline-none focus:bg-gray-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <option value={""}>Please select the category</option>
                        {Categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="text-red-500 text-sm ps-1">
                        {touched.category && errors.category && <div>{errors.category}</div>}
                    </div>
                </label>
            </div>
            <div className="mt-2">
                <label className="flex flex-col text-left">
                    Date:
                    <input 
                        type="date"
                        name="expDate"
                        value={form.expDate}
                        placeholder={new Date().toDateString()}
                        className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-gray-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="text-red-500 text-sm ps-1">
                        {touched.expDate && errors.expDate && <div>{errors.expDate}</div>}
                    </div>
                </label>
            </div>
            <div className="flex justify-end mt-5 space-x-2">
                <button 
                    type="submit" 
                    disabled={!isValid || pending.add || pending.update}
                    className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-10 py-2 disabled:bg-gray-200 disabled:text-gray-500"
                >
                {current ? pending.update ? "Updating" : "Update" : pending.add ? "Saving" : "Save" }
                </button>
                {/* {current &&  */}
                <button 
                    type="button" 
                    onClick={handleClear}
                    className="bg-gray-50 border-2 text-[#615fff] hover:opacity-80 hover:text-white hover:bg-[#615fff] hover:cursor-pointer font-bold rounded-xl px-10 py-2 disabled:bg-gray-200 disabled:text-gray-500"
                >Clear</button>
                
                {errorApi.add && <h3>{errorApi.add}</h3>}
                {errorApi.update && <h3>{errorApi.update}</h3>}
            </div>
        </form>
        </>
    );
}