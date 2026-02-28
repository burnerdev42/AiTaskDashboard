import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Mail, Globe, Building2, Calendar, User, Brain, ClipboardList,
    CheckCircle, XCircle
} from 'lucide-react';
import { storage } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const UserDetail: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user: currentUser } = useAuth();

    const [userData, setUserData] = useState<any>(null);
    const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
    const [actionTaken, setActionTaken] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!userId) return;
        const result = storage.getUserDetailByEmail(decodeURIComponent(userId));
        if (result) {
            setUserData(result.user);
            setStatus(result.status);
        }
    }, [userId]);

    if (!userData) {
        return (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <User size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>User not found.</p>
                <button onClick={() => navigate('/admin')} style={{
                    marginTop: '16px', padding: '8px 20px', background: 'var(--accent-teal)',
                    color: '#0d0f1a', border: 'none', borderRadius: '8px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit'
                }}>← Back to Control Center</button>
            </div>
        );
    }

    const email = userData.email || '';
    const name = userData.name || email.split('@')[0];
    const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    const opco = userData.opco || 'TCS — India';
    const businessUnit = userData.businessUnit || userData.role || 'General';
    const submittedDate = userData.submittedDate
        ? new Date(userData.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recently';
    const interests = userData.interests || ['Innovation', 'Technology', 'AI/ML'];

    const handleAction = (action: 'approve' | 'reject') => {
        setModalAction(action);
        setModalOpen(true);
        setReason('');
    };

    const confirmAction = () => {
        if (!reason.trim()) return;

        if (modalAction === 'approve') {
            if (storage.approveRegistration(email)) {
                storage.addAdminLog({
                    action: 'Approved Registration',
                    itemType: 'Registration',
                    itemName: email,
                    adminName: currentUser?.name || 'Admin',
                    status: 'Approved',
                    details: reason
                });
                setStatus('Approved');
                setActionTaken(true);
                showToast(`Registration approved — ${name} has been notified.`);
            }
        } else {
            if (storage.rejectRegistration(email)) {
                storage.addAdminLog({
                    action: 'Rejected Registration',
                    itemType: 'Registration',
                    itemName: email,
                    adminName: currentUser?.name || 'Admin',
                    status: 'Rejected',
                    details: reason
                });
                setStatus('Rejected');
                setActionTaken(true);
                showToast(`Registration rejected — ${name} has been notified.`, 'error');
            }
        }
        setModalOpen(false);
    };

    const statusBadgeStyle: Record<string, React.CSSProperties> = {
        Pending: {
            background: 'rgba(255,167,38,.12)', border: '1px solid rgba(255,167,38,.35)',
            color: 'var(--accent-orange)'
        },
        Approved: {
            background: 'rgba(102,187,106,.12)', border: '1px solid rgba(102,187,106,.35)',
            color: 'var(--accent-green)'
        },
        Rejected: {
            background: 'rgba(239,83,80,.12)', border: '1px solid rgba(239,83,80,.35)',
            color: 'var(--accent-red, #ef5350)'
        }
    };

    const statusLabel = status === 'Pending' ? '⏳ Pending Review' : status === 'Approved' ? '✅ Approved' : '❌ Rejected';

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' · ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px' }}>
            {/* Back Link */}
            <button
                onClick={() => navigate('/control-center')}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--accent-teal)', background: 'none', border: 'none',
                    fontSize: '13px', fontWeight: 600, marginBottom: '28px',
                    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all .2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(232,167,88,.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
                <ArrowLeft size={16} /> Back to Control Center
            </button>

            {/* User Header Card */}
            <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '32px', display: 'flex', alignItems: 'center',
                gap: '28px', marginBottom: '28px', position: 'relative', overflow: 'hidden'
            }}>
                {/* Gradient top bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue), var(--accent-purple))'
                }} />

                {/* Large Avatar */}
                <div className="profile-avatar" style={{ margin: 0 }}>
                    {initials}
                </div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>{name}</h1>
                    <div style={{
                        fontSize: '14px', color: 'var(--accent-teal)', marginBottom: '12px',
                        display: 'inline-flex', alignItems: 'center', gap: '6px'
                    }}>
                        <Mail size={14} /> {email}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '5px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '20px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)'
                        }}>
                            <Globe size={14} /> {opco}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '5px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '20px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)'
                        }}>
                            <Building2 size={14} /> {businessUnit}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '5px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '20px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)'
                        }}>
                            <Calendar size={14} /> Applied: {submittedDate}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <span style={{
                    position: 'absolute', top: '20px', right: '24px',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 16px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                    ...statusBadgeStyle[status]
                }}>
                    {statusLabel}
                </span>
            </div>

            {/* Detail Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
                {/* Personal Information */}
                <div style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '24px'
                }}>
                    <h3 style={{
                        fontSize: '14px', fontWeight: 700, color: 'var(--accent-teal)',
                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px',
                        paddingBottom: '10px', borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <User size={16} /> Personal Information
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(42,69,96,.4)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Email</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{email}</span>
                    </div>
                </div>

                {/* Registration Details */}
                <div style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '24px'
                }}>
                    <h3 style={{
                        fontSize: '14px', fontWeight: 700, color: 'var(--accent-teal)',
                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px',
                        paddingBottom: '10px', borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Building2 size={16} /> Registration Details
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(42,69,96,.4)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OpCo</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{opco}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform / Business Unit</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{businessUnit}</span>
                    </div>
                </div>

                {/* Areas of Interest — Full Width */}
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '24px'
                }}>
                    <h3 style={{
                        fontSize: '14px', fontWeight: 700, color: 'var(--accent-teal)',
                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px',
                        paddingBottom: '10px', borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Brain size={16} /> Areas of Interest
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                        {interests.map((tag: string, i: number) => (
                            <span key={i} style={{
                                padding: '5px 14px', borderRadius: '16px',
                                background: 'rgba(232,167,88,.08)', border: '1px solid rgba(232,167,88,.2)',
                                color: 'var(--accent-teal)', fontSize: '12px', fontWeight: 500
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Registration Timeline — Full Width */}
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '24px'
                }}>
                    <h3 style={{
                        fontSize: '14px', fontWeight: 700, color: 'var(--accent-teal)',
                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px',
                        paddingBottom: '10px', borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <ClipboardList size={16} /> Registration Timeline
                    </h3>
                    <div style={{ position: 'relative', paddingLeft: '28px' }}>
                        {/* Timeline line */}
                        <div style={{
                            position: 'absolute', left: '8px', top: 0, bottom: 0,
                            width: '2px', background: 'var(--border)'
                        }} />

                        {/* Step 1: Registration Submitted */}
                        <div style={{ position: 'relative', paddingBottom: '20px' }}>
                            <div style={{
                                position: 'absolute', left: '-24px', top: '4px',
                                width: '14px', height: '14px', borderRadius: '50%',
                                border: '2px solid var(--accent-teal)',
                                background: 'var(--accent-teal)',
                                boxShadow: '0 0 8px rgba(232,167,88,.4)'
                            }} />
                            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Registration Submitted</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{submittedDate} — Application form completed</p>
                        </div>

                        {/* Step 2: Email Verification */}
                        <div style={{ position: 'relative', paddingBottom: '20px' }}>
                            <div style={{
                                position: 'absolute', left: '-24px', top: '4px',
                                width: '14px', height: '14px', borderRadius: '50%',
                                border: '2px solid var(--accent-teal)',
                                background: 'var(--accent-teal)',
                                boxShadow: '0 0 8px rgba(232,167,88,.4)'
                            }} />
                            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Email Verification</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{submittedDate} — Corporate email verified</p>
                        </div>

                        {/* Step 3: Review Status */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '-24px', top: '4px',
                                width: '14px', height: '14px', borderRadius: '50%',
                                border: `2px solid ${status === 'Approved' ? 'var(--accent-green)' : status === 'Rejected' ? 'var(--accent-red, #ef5350)' : 'var(--accent-teal)'}`,
                                background: status !== 'Pending' ? (status === 'Approved' ? 'var(--accent-green)' : 'var(--accent-red, #ef5350)') : 'var(--bg-primary)',
                                boxShadow: status !== 'Pending' ? `0 0 8px ${status === 'Approved' ? 'rgba(102,187,106,.4)' : 'rgba(239,83,80,.4)'}` : 'none'
                            }} />
                            <h4 style={{
                                fontSize: '13px', fontWeight: 600, marginBottom: '3px',
                                color: status === 'Approved' ? 'var(--accent-green)' : status === 'Rejected' ? 'var(--accent-red, #ef5350)' : 'var(--text-primary)'
                            }}>
                                {status === 'Pending' ? 'Awaiting Admin Review' : status === 'Approved' ? 'Registration Approved' : 'Registration Rejected'}
                            </h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {status === 'Pending' ? 'Pending — Waiting for admin approval' : `${timeStr} — ${status} by ${currentUser?.name || 'Admin'}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '24px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: '28px'
            }}>
                {status === 'Pending' && !actionTaken ? (
                    <>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            This registration is <span style={{ color: 'var(--accent-orange)' }}>pending review</span>. Take an action below.
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleAction('approve')} style={{
                                padding: '10px 24px', border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit', background: 'var(--accent-green)', color: '#0d0f1a',
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                transition: 'all .2s'
                            }}>
                                <CheckCircle size={16} /> Approve Registration
                            </button>
                            <button onClick={() => handleAction('reject')} style={{
                                padding: '10px 24px', borderRadius: '8px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit',
                                background: 'rgba(239,83,80,.15)', color: 'var(--accent-red, #ef5350)',
                                border: '1px solid rgba(239,83,80,.3)',
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                transition: 'all .2s'
                            }}>
                                <XCircle size={16} /> Reject Registration
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Registration <span style={{ color: status === 'Approved' ? 'var(--accent-green)' : 'var(--accent-red, #ef5350)' }}>
                                {status === 'Approved' ? 'approved' : 'rejected'}
                            </span>. {status === 'Approved' ? 'The user has been notified.' : ''}
                        </div>
                        <span style={{
                            color: status === 'Approved' ? 'var(--accent-green)' : 'var(--accent-red, #ef5350)',
                            fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px'
                        }}>
                            {status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            Done
                        </span>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}</h3>
                        <p>Are you sure you want to {modalAction} the registration for <strong>{name}</strong>?</p>

                        <div className="modal-item-highlight">
                            <strong>Email:</strong> {email}
                        </div>

                        <div style={{ marginBottom: '4px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Comment <span style={{ color: 'var(--accent-red, #ef5350)' }}>*</span>
                            </label>
                        </div>
                        <textarea
                            placeholder="Add a note or reason (required)..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{ borderColor: !reason.trim() ? 'var(--accent-red, #ef5350)' : undefined }}
                        />
                        {!reason.trim() && (
                            <p style={{ fontSize: '12px', color: 'var(--accent-red, #ef5350)', margin: '4px 0 0' }}>
                                A comment is required to proceed.
                            </p>
                        )}

                        <div className="modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button
                                className={`btn-confirm-${modalAction}`}
                                onClick={confirmAction}
                                disabled={!reason.trim()}
                                style={{ opacity: !reason.trim() ? 0.5 : 1, cursor: !reason.trim() ? 'not-allowed' : 'pointer' }}
                            >
                                {modalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
