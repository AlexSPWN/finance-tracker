import type { PaginationProp } from "../../types/Pagination";

type Props = {
    pagination: PaginationProp;
    goToPage: (page: number) => void;
}
export const Pagination = ({pagination, goToPage} : Props) => {

    // improve in the future to the format [1 2 3 ... 200]
    const pages = [];
    for(let i = 1; i<=pagination.totalPages; i++ )
    {
        pages.push(i);
    }

    return (<div>
        {pages.length === 1 ? "No pages" : 
            (<>
            <button 
                type="button" 
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
            >Prev</button>
            {pages.map(p => <button key={p} type="button" disabled={p === pagination.page} onClick={() => goToPage(p)}>{p}</button>)}
            <button 
                type="button" 
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
            >Next</button>
            </>)
        }
    </div>);
}