import { memo, useState } from "react";
import type { Item, PendingState } from "../types/Item"
import { Modal } from "./common/Modal";
import { ConfirmDialog } from "./common/ConfirmDialog";

type Props = {
    item: Item,
    setCurrent: (item: Item | undefined) => void;
    remove: (id: number) => void;
    pending: PendingState;
}
export const ItemEntry = memo(({item, setCurrent, remove, pending}: Props) => {

    const [showDialog, setShowDialog] = useState(false);

    const handleDelete = () => {
        setShowDialog(true);
    }

    const confirmDelete = () => {
        remove(item.id);
        setShowDialog(false);
    }

    return (<>
        {showDialog && (
            <Modal onClose={() => setShowDialog(false)}>
                <ConfirmDialog 
                    title="Delete item"
                    message="Are you sure?"
                    confirmButtonName="Delete"
                    onConfirm={confirmDelete}
                    onCancel={()=> setShowDialog(false)}
                />
            </Modal>
        )}
        <div>{item.name} | {item.price}$ | {item.id}</div>
        <button 
            type="button" 
            onClick={() => setCurrent({...item})}
        >Edit</button>
        <button 
            type="button"
            onClick={handleDelete}
            disabled={pending.remove}
        >Delete</button>
    </>)
});