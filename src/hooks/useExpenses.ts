import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react";
import { expenseService } from "../services/expenseService";
import type { Expense, ExpenseExt, ExpenseFormProps } from "../types/Expense";
import type { ErrorState, Operations, PendingState } from "../types/Operations";
import type { PaginationProp } from "../types/Pagination";



const expenseReducer = (
    state: ExpenseExt[],
    action: 
        | {type: "Add", payload: Expense}
        | {type: "Update", payload: Expense}
        | {type: "Remove", payload: string}
): ExpenseExt[] => {
    switch(action.type) {
        case "Add":
            return [{...action.payload, adding: true}, ...state]
        case "Update":
            return state.map(prev => prev.id === action.payload.id ? {...action.payload, updating: true} : prev)
        case "Remove":
            //return state.filter(prev => prev.id !== action.payload)
            return state.map(prev => prev.id === action.payload ? {...prev, deleting: true } : prev)
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
    const [expenses, setExpenses] = useState<ExpenseExt[]>([]);
    const [optimisticExpenses, dispatch] = useOptimistic(expenses, expenseReducer);
    const [current, setCurrent] = useState<Expense | undefined>(undefined);
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

    //return here to fix soft load when expenseslength changes
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
                    //pageSize: expenses.length !== pageSize ? expenseReponse.pageSize : expenseReponse.pageSize,
                    pageSize: expenseReponse.pageSize,
                    totalItems: expenseReponse.totalItems,
                    totalPages: expenseReponse.totalPages
                });       
            } catch (err) {
                handleError("load", err);
            } finally {
                handlePending("load", false)
            }
        }        
        getExpenses();
        return () => controller.abort();
    }, [currentPage, pageSize]); //, expenses.length

    const add = async (expense: ExpenseFormProps) => {
        handlePending("add", true);
        handleError("add", undefined);
        const tmpExpense: Expense = {...expense, type: expense.type!, amount: Number(expense.amount!), id: crypto.randomUUID()};

        startTransition(async () => {
            dispatch({type: "Add", payload: tmpExpense });
            try {
                await new Promise((res) => setTimeout(res, 1000));
                const newExpense = await expenseService.add({...expense, expDate: new Date(expense.expDate).toISOString()});
                setExpenses(prev => ([newExpense, ...prev]));
                handlePending("add", false);
                setCurrentPage(1);
            } catch (err) {
                handleError("add", err);
            } finally {
                handlePending("add", false);
            }
        });            
    }

    const update = async (expense: Expense) => {
        handlePending("update", true);
        handleError("update", undefined);

        startTransition(async() => {
            dispatch({type: "Update", payload: expense})
            try {
                await expenseService.update(expense.id, {...expense, amount: String(expense.amount), expDate: new Date(expense.expDate).toISOString()});
                setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
                setCurrent(prev => prev?.id === expense.id ? undefined : prev);
            } catch (err) {
                handleError("update", err);        
            } finally {
                handlePending("update", false);
            }
        });
    }

    const remove = useCallback(async (id: string) => {
        handlePending("remove", true);
        handleError("remove", undefined);

        startTransition(async () => {
            dispatch({type: "Remove", payload: id});
            try {
                await expenseService.remove(id);
                setExpenses(prev => prev.filter(e => e.id !== id));
                setCurrent(prev => prev?.id === id ? undefined : prev);
            } catch (err) {
                handleError("remove", err);
            } finally {
                handlePending("remove", false);                
            }
            /* if(expenses.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev -1);
            } */
        });
    }, [dispatch]); //currentPage, expenses.length

    const updateCurrent = useCallback((expense: Expense | undefined) => {
        //console.log(expense);
        //const tmpDate = expense ? expense.expDate.substring(0, 10) : new Date().toISOString().substring(0, 10);

        if(expense) {
            setCurrent({...expense, expDate: expense.expDate.substring(0,10)});
        } else {
            setCurrent(undefined);
        }
    }, [])

    return {expenses: optimisticExpenses, 
        current, updateCurrent,
        pagination, setCurrentPage, setPageSize, 
        add, update, remove,
        pending, error}
}