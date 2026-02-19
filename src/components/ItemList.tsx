import type { ErrorState, Item, PendingState } from "../types/Item";
import { ItemEntry } from "./ItemEntry";

type Props = {
    items: Item[];
    setCurrent: (item: Item | undefined) => void;
    remove: (id: number) => void;
    pending: PendingState;
    error: ErrorState;
}
export const ItemList = ({items, setCurrent, remove, pending, error}: Props) => {

    return (<>
        {pending.load ? <h2>Loading...</h2> : error.load ? <h2>{error.load}</h2> :
            items.length === 0 ? "No items yet" :
            items.map(i => <ItemEntry key={i.id} item={i} remove={remove} setCurrent={setCurrent} pending={pending} />)
        }
    </>);
}