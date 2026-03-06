type Props = {
    currentValue: number;
    setPageSize: (size: number) => void;

}

export const PageSizeSelector = ({currentValue, setPageSize}: Props) => {
    const options = [5, 10, 25, 50];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
    }

    return (
        <div className="flex rounded-xl bg-yellow-50 py-2 px-5 my-2">
            Items per page:
            <select 
                name="pageSizeSelector" 
                onChange={handleChange} 
                value={currentValue}
                className="bg-gray-50 rounded py-1 px-2 focus:outline-none focus:bg-white"
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}