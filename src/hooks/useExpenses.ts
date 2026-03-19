import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react";
import { expenseService } from "../services/expenseService";
import type { Expense, ExpenseExt, ExpenseFormProps, ExpenseQuery } from "../types/Expense";
import type { ErrorState, Operations, PendingState } from "../types/Operations";
import type { PaginationProp } from "../types/Pagination";
import { useDebounce } from "./useDebounce";

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
            return state.map(prev => prev.id === action.payload ? {...prev, deleting: true } : prev)
        default:
            return state
    }
}

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

    // query params
    const [query, setQuery] = useState<ExpenseQuery>({
        page: 1,
        pageSize: 5
    });

    const setCurrentPage = (page: number) => {
        setQuery(prev => ({...prev, page}));
    }

    const setPageSize = (pageSize: number) => {
        setQuery(prev => ({
            ...prev,
            page: 1,
            pageSize
        }));
    }

    // sorting by pressing the same column
    const setSortBy = (sortBy?: string) => {
        setQuery(prev => {
            // if new column: start with ASC
            if (prev.sortBy !== sortBy) {
                return { ...prev, sortBy, sortOrder: "asc" };
            }
            // if the same column: toggle ASC to DESC
            if (prev.sortOrder === "asc") {
                return { ...prev, sortOrder: "desc" };
            }
            // if DESC: remove sorting
            return {
                ...prev,
                sortBy: undefined,
                sortOrder: undefined
            };
        } )
    }

    /* const setSortOrder = (sortOrder?: "asc" | "desc") => {
        setQuery(prev => ({...prev, sortOrder}))
    } */

    const [rawSearch, setRawSearch] = useState<string | undefined>("");
    const debounceSearch = useDebounce(rawSearch, 500);

    useEffect(() => {
        setQuery(prev => ({
            ...prev,
            page: 1,
            search: debounceSearch || undefined
        }));
    }, [debounceSearch]);

    const setSearch = useCallback((searchText?: string) => {
        setRawSearch(searchText);
    }, []);

    /* const setSearch = useCallback((searchText?: string) => {
        setQuery(prev => {
            if(searchText) return {
                ...prev,
                search: searchText
            }
            return {
                ...prev,
                search: undefined
            }
        })
    }, []); */

    const [pending, setPending] = useState<PendingState>({
            load: false,
            add: false,
            update: false,
            remove: false
    });
    
    const handlePending = (key: Operations , value: boolean) => {
        setPending(prev => ({
            ...prev,
            [key]: value
        }));
    }
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

    useEffect(() => {
        const controller = new AbortController();      
        const getExpenses = async () => {
            handlePending("load", true);
            handleError("load", undefined);
                try {
                    const expenseReponse = await expenseService.getAllNew(query, controller?.signal);
                    setExpenses(expenseReponse.items);
                    setPagination({
                        page: expenseReponse.page,
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
    }, [query]);

    const add = async (expense: ExpenseFormProps) => {
        handlePending("add", true);
        handleError("add", undefined);
        const tmpExpense: Expense = {...expense, type: expense.type!, amount: Number(expense.amount!), id: crypto.randomUUID()};

        startTransition(async () => {
            dispatch({type: "Add", payload: tmpExpense });
            try {
                const newExpense = await expenseService.add({...expense, expDate: new Date(expense.expDate).toISOString()})
                setExpenses(prev => ([newExpense, ...prev]));
                handlePending("add", false);
                setQuery(prev => ({
                    ...prev,
                    page: 1
                }));
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
                await expenseService.update(expense.id, {...expense, amount: String(expense.amount), expDate: new Date(expense.expDate).toISOString()})
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
                await expenseService.remove(id)
                setExpenses(prev => prev.filter(e => e.id !== id));
                setQuery(prev => {
                    const shouldMovePage = prev.page! > 1 && expenses.length === 1;
                    return {
                        ...prev,
                        page: shouldMovePage ? prev.page! - 1 : prev.page
                    };
                });
                setCurrent(prev => prev?.id === id ? undefined : prev);
            } catch (err) {
                handleError("remove", err);
            } finally {
                handlePending("remove", false);                
            }
            
        });
    }, [dispatch, expenses.length]);

    const updateCurrent = useCallback((expense: Expense | undefined) => {
        if(expense) {
            setCurrent({...expense, expDate: expense.expDate.substring(0,10)});
        } else {
            setCurrent(undefined);
        }
    }, [])

    return {
        expenses: optimisticExpenses, 
        current, updateCurrent,
        pagination, setCurrentPage, setPageSize, 
        query, setSortBy, setSearch,
        //setSortOrder,
        add, update, remove,
        pending,
        error
    }
}