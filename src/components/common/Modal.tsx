import { useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";

type Props = {
    children: ReactNode;
    onClose: () => void;
}
export const Modal = ({children, onClose}: Props) => {

    const modalRoot = document.getElementById('modal-root') as HTMLElement;

    // Close when Esc
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if(e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler)
    }, [onClose]);

    return ReactDOM.createPortal(
        <div>
            {/* backdrop */}
            <div onClick={onClose} />
            {/* Modal content */}
            <div>
                {children}
            </div>
        </div>,
        modalRoot
    );
}