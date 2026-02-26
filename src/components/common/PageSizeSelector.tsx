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
        <div>
            <select name="pageSizeSelector" onChange={handleChange} value={currentValue}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}