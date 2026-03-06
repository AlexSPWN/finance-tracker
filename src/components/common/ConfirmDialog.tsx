type Props = {
    title?: string;
    message?: string;
    confirmButtonName?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
export const ConfirmDialog = ({
    title = "Confirm",
    message = "Are you sure",
    confirmButtonName = "Ok",
    onConfirm,
    onCancel
}: Props) => {

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            <p className="mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
                <button 
                    type="button" 
                    onClick={onConfirm}
                    className="px-4 py-2 bg-gray-300 rounded"
                >{confirmButtonName}</button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >Cancel</button>
            </div>
        </div>
    );
}