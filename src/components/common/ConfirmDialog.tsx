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
            <h2>{title}</h2>
            <p>{message}</p>
            <div>
                <button 
                    type="button" 
                    onClick={onConfirm}
                >{confirmButtonName}</button>
                <button
                    type="button"
                    onClick={onCancel}
                >Cancel</button>
            </div>
        </div>
    );
}