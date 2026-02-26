import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react";
import { expenseService } from "../services/expenseService";
import type { Expense, ExpenseFormProps } from "../types/Expense";
import type { ErrorState, Operations, PendingState } from "../types/Operations";
import type { PaginationProp } from "../types/Pagination";

const expenseReducer = (
    state: Expense[],
    action: 
        | {type: "Add", payload: Expense}
        | {type: "Update", payload: Expense}
        | {type: "Remove", payload: string}
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
/* type PropsReturn = {
    expenses: Expense[],
    pagination: PaginationProp,
    pending: PendingState,
    error: ErrorState
} */
export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [optimisticExpenses, dispatch] = useOptimistic(expenses, expenseReducer);
    const [pagination, setPagination] = useState<PaginationProp>({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

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
        const getExpenses = async () => {
            handlePending("load", true);
            handleError("load", undefined);
            try {
                const expenseReponse = await expenseService.getAll(currentPage, pageSize, controller?.signal);
                setExpenses(expenseReponse.items);
                setPagination({
                    page: expenseReponse.page,
                    pageSize: expenseReponse.pageSize,
                    totalItems: expenseReponse.totalItems,
                    totalPages: expenseReponse.totalPages
                })
            } catch (err) {
                handleError("load", err);
            } finally {
                handlePending("load", false)
            }
        }
        getExpenses();
        return () => controller.abort();
    }, [currentPage, pageSize]);

    const add = async (expense: ExpenseFormProps) => {
        handlePending("add", true);
        handleError("add", undefined);
        const tmpExpense: Expense = {...expense, id: crypto.randomUUID()};
        startTransition(() => {
            dispatch({type: "Add", payload: tmpExpense })
        });
        try {
            const newExpense = await expenseService.add(expense);
            //setExpenses(prev => ([...prev, newExpense]));
            setExpenses(prev => prev.map(e => e.id === tmpExpense.id ? newExpense: e));
        } catch (err) {
            handleError("add", err);
        } finally {
            handlePending("add", false);
        }
    }

    const update = async (expense: Expense) => {
        handlePending("update", true);
        handleError("update", undefined);
        startTransition(() => {
            dispatch({type: "Update", payload: expense})
        });
        try {
            await expenseService.update(expense.id, expense);
            setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
        } catch (err) {
            handleError("update", err);
        } 
        finally {
            handlePending("update", false);
        }
    }

    const remove = useCallback(async (id: string) => {
        handlePending("remove", true);
        handleError("remove", undefined);
        startTransition(() => {
            dispatch({type: "Remove", payload: id})
        });
        try {
            await expenseService.remove(id);
            if(expenses.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev -1);
            }
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            handleError("remove", err);
        } 
        finally {
            handlePending("remove", false);
        }
    }, [dispatch, currentPage, expenses.length]);

    return {expenses: optimisticExpenses, pagination, 
        setCurrentPage, setPageSize, 
        add, update, remove,
        pending, error}
}