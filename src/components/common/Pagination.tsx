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

    return (<div className="flex justify-start py-5">
        {pages.length === 1 ? "" : 
            (<>
            <button 
                type="button" 
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-4 py-2 me-1 disabled:bg-gray-200 disabled:text-gray-500"
            >Prev</button>
            {pages.map(p => 
                <button key={p} 
                    type="button" 
                    disabled={p === pagination.page} 
                    onClick={() => goToPage(p)}
                    className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-4 py-2 me-1 disabled:bg-gray-200 disabled:text-gray-500"
                >{p}</button>)}
            <button 
                type="button" 
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="bg-[#615fff] hover:opacity-80 hover:text-white hover:cursor-pointer font-bold text-amber-50 rounded-xl px-4 py-2 disabled:bg-gray-200 disabled:text-gray-500"
            >Next</button>
            </>)
        }
    </div>);
}