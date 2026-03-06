import { useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";

type Props = {
    children: ReactNode;
    onClose: () => void;
}
export const Modal = ({children, onClose }: Props) => {

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
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* backdrop */}
            <div onClick={onClose} className="absolute inset-0 bg-black/50" />
            {/* Modal content */}
            <div className="relative z-50 bg-white dark:bg-stone-400 rounded shadow-xl p-6 w-80">
                {children}
            </div>
        </div>,
        modalRoot
    );
}