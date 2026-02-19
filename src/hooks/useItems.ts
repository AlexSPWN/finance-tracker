import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react"
import type { ErrorState, Item, ItemForm, Operations, PendingState } from "../types/Item";
import { itemsService } from "../services/itemsService";

const itemsReducer = (
    state: Item[], 
    action: 
        | { type: "Add", payload: Item }
        | { type: "Update", payload: Item }
        | { type: "Remove", payload: number }
) => {
    switch(action.type) {
        case "Add":
            return [...state, action.payload]
        case "Update":
            return state.map(prev => prev.id === action.payload.id ? action.payload : prev)
        case "Remove":
            return state.filter(prev => prev.id !== action.payload)
        default:
            return state
    }
}

type UseItemsReturn = {
  items: Item[];
  current: Item | undefined;
  updateCurrent: (item: Item | undefined) => void;
  add: (item: ItemForm) => Promise<void>;
  update: (item: Item) => Promise<void>;
  remove: (id: number) => Promise<void>;
  pending: PendingState;
  error: ErrorState;
};
export const useItems = (): UseItemsReturn => {
    const [items, setItems] = useState<Item[]>([]);
    const [optimisticItems, dispatch] = useOptimistic(items, itemsReducer);

    const [current, setCurrent] = useState<Item | undefined>(undefined);

    const [pending, setPending] = useState<PendingState>({
        load: false,
        add: false,
        update: false,
        remove: false
    });
    const [error, setError] = useState<ErrorState>({});

    const handleError = (key: Operations, err: unknown) => {
        if(err instanceof Error) {
            if(err.name === "AbortError") return;
            setError(prev => ({
                ...prev,
                [key]: err.message
            }));
        } else if (err === undefined) {
            setError(prev => ({
                ...prev,
                [key]: undefined
            }))
        }
        else {
            setError(prev => ({
                ...prev,
                [key]: "Unknown error"
            }));
        }
    }

    const handlePending = (key: Operations , value: boolean) => {
        setPending(prev => ({
            ...prev,
            [key]: value
        }));
    }

    useEffect(() => {
        const controller = new AbortController();
        const getItems = async () => {
            handlePending("load", true);
            handleError("load", undefined);
            try {                
                const items = await itemsService.getAll(controller.signal);
                setItems(items);
            } catch (err) {
                handleError("load", err);
            } finally {
                handlePending("load", false)
            }
        };
        getItems();
        return () => controller.abort();
    }, []);

    const add = async (item: ItemForm) => {
        handlePending("add", true);
        handleError("add", undefined);
        const tmpItem: Item = {...item, id: -Date.now(), price: item.price!};
        startTransition(() => {
            dispatch({type: "Add", payload: tmpItem })
        });
        try {
            const newItem = await itemsService.add(item);
            setItems(prev => ([
                ...prev,
                newItem
            ]))
        } catch (err) {
            handleError("add", err);
        } finally {
            handlePending("add", false);
        }
    }

    const update = async (item: Item) => {
        handlePending("update", true);
        handleError("update", undefined);
        startTransition(() => {
            dispatch({type: "Update", payload: item})
        });
        try {
            await itemsService.update(item);
            setItems(prev => prev.map(i => i.id === item.id ? item : i));
            setCurrent(prev => prev?.id === item.id ? undefined : prev)
        } catch (err) {
            handleError("update", err);
        } 
        finally {
            handlePending("update", false);
        }
    }

    const remove = useCallback(async (id: number) => {
        handlePending("remove", true);
        handleError("remove", undefined);
        startTransition(() => {
            dispatch({type: "Remove", payload: id})
        });
        try {
            await itemsService.remove(id);
            setItems(prev => prev.filter(i => i.id !== id));
            setCurrent(prev => prev?.id === id ? undefined : prev)
        } catch (err) {
            handleError("remove", err);
        } 
        finally {
            handlePending("remove", false);
        }
    }, [dispatch])

    const updateCurrent = useCallback((item: Item | undefined) => {
        setCurrent(item);
    }, []) 

    return {items: optimisticItems, current, updateCurrent, add, update, remove, pending, error}
    
}