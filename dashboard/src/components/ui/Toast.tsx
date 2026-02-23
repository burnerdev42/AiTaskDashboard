import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    const [shouldRender, setShouldRender] = useState(isVisible);
    const [animateIn, setAnimateIn] = useState(false);

    // Persist onClose without resetting the effect timers continually
    const onCloseRef = React.useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        let enterTimer: ReturnType<typeof setTimeout>;
        let hideTimer: ReturnType<typeof setTimeout>;
        let removeTimer: ReturnType<typeof setTimeout>;

        if (isVisible) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShouldRender(true);

            // Allow DOM to be created before applying transition trigger
            enterTimer = setTimeout(() => {
                setAnimateIn(true);
            }, 50);

            if (duration > 0) {
                hideTimer = setTimeout(() => {
                    onCloseRef.current();
                }, duration);
            }
        } else {
            setAnimateIn(false);

            // Wait for exit transition to finish before removing from DOM
            removeTimer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
        }

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, [isVisible, duration]);

    if (!shouldRender) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="toast-icon success" />;
            case 'error':
                return <AlertCircle size={20} className="toast-icon error" />;
            case 'info':
                return <Info size={20} className="toast-icon info" />;
        }
    };

    return (
        <div className={`toast-container ${animateIn ? 'toast-enter' : 'toast-exit'}`}>
            <div className={`toast-box toast-${type}`}>
                <div className="toast-icon-wrapper">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    {message}
                </div>
                <button className="toast-close" onClick={() => onCloseRef.current()} aria-label="Close Toast">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
