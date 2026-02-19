import { useState } from "react";
import { useItemsForm } from "../hooks/useItemsForm";
import type { ErrorState, Item, ItemForm, PendingState } from "../types/Item";
import { Modal } from "./common/Modal";
import { ConfirmDialog } from "./common/ConfirmDialog";

type Props = {
    add: (item: ItemForm) => Promise<void>;
    update: (item: Item) => Promise<void>;
    current: Item | undefined;
    setCurrent: (item: Item | undefined) => void;
    pending: PendingState;
    errorApi: ErrorState;
}
export const ItemsForm = ({add, update, current, setCurrent, pending, errorApi}: Props) => {
    const {form, handleSubmit, reset, 
        handleChange, handleBlur, handleClear, 
        errors, isValid, touched } 
    = useItemsForm({current, setCurrent});

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<Item | null>(null);

        
    const onSubmit = async (e: React.FormEvent) => {
        const data = handleSubmit(e);
        if (!data) return;
        if (current) {
            setPendingUpdateData({id: current.id, name: data.name, price: data.price!});
            setShowConfirm(true);
            //await update();
            //setCurrent(undefined);
        } else {
            await add(data);
            reset();
        }
    };

    const confirmUpdate = async () => {
        if (!pendingUpdateData) return;
        await update(pendingUpdateData); // call your hook update
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
                    title="Update item"
                    message="Are you sure you want to update this item?"
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
                    <input type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} />
                </label>
                {touched.name && errors.name && <div>{errors.name}</div>}
            </div>
            <div>
                <label>
                    Price:
                    <input type="number" name="price" value={form.price ?? ""} onChange={handleChange} onBlur={handleBlur}/>
                </label>
                {touched.price && errors.price && <div>{errors.price}</div>}
            </div>
            <div>
                <button type="submit" 
                    disabled={!isValid || pending.add || pending.update}
                >{current ? pending.update ? "Updating" : "Update" : pending.add ? "Saving" : "Save" }</button>
                {current && <button type="button" onClick={handleClear}>Clear</button>}
                {errorApi.add && <h3>{errorApi.add}</h3>}
                {errorApi.update && <h3>{errorApi.update}</h3>}
            </div>
        </form>
        </>
    );
}