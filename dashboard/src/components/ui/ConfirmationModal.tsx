import React from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const brandColor = type === 'danger' ? 'var(--accent-red)' : type === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-blue)';
    const headerGradient = type === 'danger'
        ? 'linear-gradient(135deg, #ff5252, #f44336)'
        : 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))';

    return createPortal(
        <div className="detail-modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="detail-modal-dialog animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${type === 'danger' ? 'rgba(255, 82, 82, 0.2)' : 'var(--border)'}` }}>
                <div className="detail-modal-header" style={{ borderBottom: 'none', padding: '24px 28px 12px' }}>
                    <h2 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: headerGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '20px'
                    }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            WebkitTextFillColor: 'initial',
                            color: brandColor,
                            filter: type === 'danger' ? 'drop-shadow(0 0 8px rgba(255,82,82,0.2))' : 'none'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {type === 'danger' || type === 'warning' ? (
                                    <>
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </>
                                ) : (
                                    <>
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </>
                                )}
                            </svg>
                        </span>
                        {title}
                    </h2>
                    <button className="detail-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="detail-modal-body" style={{ padding: '0 28px 28px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '15px' }}>
                            {message}
                        </p>
                    </div>
                    <div className="modal-actions" style={{
                        padding: '16px 24px',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            className="btn-cancel btn-sm"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`btn-sm ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '42px',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '600',
                                border: '1px solid transparent',
                                boxShadow: type === 'danger' ? '0 4px 12px rgba(255, 82, 82, 0.3)' : '0 4px 12px rgba(0, 150, 136, 0.3)'
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
