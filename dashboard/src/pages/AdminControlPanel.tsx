import React, { useState, useEffect } from 'react';
import {
    Zap, Clock, CheckCircle, XCircle, Users,
    User, Mail, Building2, Shield, Search,
    Flag, Lightbulb, History, Filter, AlertCircle, AlertTriangle
} from 'lucide-react';
import { storage } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { type User as UserType, type Challenge, type Idea, type AdminLog } from '../types';

export const AdminControlPanel: React.FC = () => {
    const { showToast } = useToast();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'pending' | 'registrations' | 'challenges' | 'ideas' | 'history'>('pending');
    const [subFilter, setSubFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [pendingRegs, setPendingRegs] = useState<any[]>([]);
    const [rejectedRegs, setRejectedRegs] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        totalUsers: 0
    });

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        action: 'approve' | 'reject';
        type: 'registration' | 'challenge' | 'idea';
        itemName: string;
        itemId: string;
        reason: string;
    }>({
        isOpen: false,
        action: 'approve',
        type: 'registration',
        itemName: '',
        itemId: '',
        reason: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const pRegs = storage.getPendingRegistrations();
        const rRegs = storage.getRejectedRegistrations();
        const users = storage.getUsers();
        const challs = storage.getChallenges();
        const ideList = storage.getIdeaDetails();
        const logs = storage.getAdminLogs();

        setPendingRegs(pRegs);
        setRejectedRegs(rRegs);
        setAllUsers(users);
        setChallenges(challs);
        setIdeas(ideList);
        setAdminLogs(logs);

        // Calculate global stats
        const pChalls = challs.filter((c: Challenge) => !c.approvalStatus || c.approvalStatus === 'Pending').length;
        const pIdeas = ideList.filter((i: Idea) => !i.approvalStatus || i.approvalStatus === 'Pending').length;

        const aChalls = challs.filter((c: Challenge) => c.approvalStatus === 'Approved').length;
        const aIdeas = ideList.filter((i: Idea) => i.approvalStatus === 'Approved').length;

        const rChalls = challs.filter((c: Challenge) => c.approvalStatus === 'Rejected').length;
        const rIdeas = ideList.filter((i: Idea) => i.approvalStatus === 'Rejected').length;

        setStats({
            pending: pRegs.length + pChalls + pIdeas,
            approved: users.filter(u => u.role !== 'Admin').length + aChalls + aIdeas,
            rejected: rRegs.length + rChalls + rIdeas,
            totalUsers: users.length
        });
    };

    const openModal = (action: 'approve' | 'reject', type: 'registration' | 'challenge' | 'idea', name: string, id: string) => {
        setModalConfig({
            isOpen: true,
            action,
            type,
            itemName: name,
            itemId: id,
            reason: ''
        });
    };

    const handleConfirmAction = () => {
        const { action, type, itemId, itemName, reason } = modalConfig;

        if (action === 'approve') {
            if (type === 'registration') handleApproveRegistration(itemId);
            else if (type === 'challenge') handleApproveChallenge(itemId);
            else if (type === 'idea') handleApproveIdea(itemId);
        } else {
            if (type === 'registration') handleRejectRegistration(itemId);
            else if (type === 'challenge') handleRejectChallenge(itemId);
            else if (type === 'idea') handleRejectIdea(itemId);
        }

        // Log the reason if provided
        if (reason.trim()) {
            storage.addAdminLog({
                action: `${action === 'approve' ? 'Approved' : 'Rejected'} with Note`,
                itemType: type.charAt(0).toUpperCase() + type.slice(1) as any,
                itemName: `${itemName} (Note: ${reason})`,
                adminName: currentUser?.name || 'Admin',
                status: action === 'approve' ? 'Approved' : 'Rejected'
            });
        }

        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleApproveRegistration = (email: string) => {
        if (storage.approveRegistration(email)) {
            storage.addAdminLog({
                action: 'Approved Registration',
                itemType: 'Registration',
                itemName: email,
                adminName: currentUser?.name || 'Admin',
                status: 'Approved'
            });
            showToast(`Registration for ${email} has been approved.`);
            loadData();
        }
    };

    const handleRejectRegistration = (email: string) => {
        if (storage.rejectRegistration(email)) {
            storage.addAdminLog({
                action: 'Rejected Registration',
                itemType: 'Registration',
                itemName: email,
                adminName: currentUser?.name || 'Admin',
                status: 'Rejected'
            });
            showToast(`Registration for ${email} has been rejected.`, 'error');
            loadData();
        }
    };

    const handleApproveChallenge = (id: string) => {
        if (storage.approveChallenge(id, currentUser?.name || 'Admin')) {
            showToast('Challenge approved successfully.');
            loadData();
        }
    };

    const handleRejectChallenge = (id: string) => {
        if (storage.rejectChallenge(id, currentUser?.name || 'Admin')) {
            showToast('Challenge rejected.', 'error');
            loadData();
        }
    };

    const handleApproveIdea = (id: string) => {
        if (storage.approveIdea(id, currentUser?.name || 'Admin')) {
            showToast('Idea approved successfully.');
            loadData();
        }
    };

    const handleRejectIdea = (id: string) => {
        if (storage.rejectIdea(id, currentUser?.name || 'Admin')) {
            showToast('Idea rejected.', 'error');
            loadData();
        }
    };

    // Filtering logic
    const getFilteredItems = () => {
        const lowerSearch = searchTerm.toLowerCase();
        let items: any[] = [];

        switch (activeTab) {
            case 'pending':
                const pRegs = pendingRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Pending' }));
                const pChalls = challenges.filter(c => !c.approvalStatus || c.approvalStatus === 'Pending').map(c => ({ ...c, type: 'challenge', approvalStatus: 'Pending' }));
                const pIdeas = ideas.filter(i => !i.approvalStatus || i.approvalStatus === 'Pending').map(i => ({ ...i, type: 'idea', approvalStatus: 'Pending' }));
                items = [...pRegs, ...pChalls, ...pIdeas];
                break;

            case 'registrations':
                const regPend = pendingRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Pending' }));
                const regApp = allUsers.filter(u => u.role !== 'Admin').map(u => ({ ...u, type: 'registration', approvalStatus: 'Approved' }));
                const regRej = rejectedRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Rejected' }));
                items = [...regPend, ...regApp, ...regRej];
                break;

            case 'challenges':
                items = challenges.map(c => ({ ...c, type: 'challenge', approvalStatus: c.approvalStatus || 'Pending' }));
                break;

            case 'ideas':
                items = ideas.map(i => ({ ...i, type: 'idea', approvalStatus: i.approvalStatus || 'Pending' }));
                break;

            case 'history':
                return adminLogs.filter(log =>
                    log.action.toLowerCase().includes(lowerSearch) ||
                    log.itemName.toLowerCase().includes(lowerSearch)
                ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        return items.filter(item => {
            const matchesSearch = (item.name || item.title || '').toLowerCase().includes(lowerSearch) ||
                (item.email || '').toLowerCase().includes(lowerSearch);

            if (!matchesSearch) return false;
            if (activeTab === 'pending') return true;

            if (subFilter === 'all') return true;
            return item.approvalStatus === (subFilter.charAt(0).toUpperCase() + subFilter.slice(1));
        });
    };

    const filteredItems = getFilteredItems();

    const getSubFilterCounts = () => {
        let currentTabItems: any[] = [];
        switch (activeTab) {
            case 'registrations':
                currentTabItems = [
                    ...pendingRegs.map(() => ({ approvalStatus: 'Pending' })),
                    ...allUsers.filter(u => u.role !== 'Admin').map(() => ({ approvalStatus: 'Approved' })),
                    ...rejectedRegs.map(() => ({ approvalStatus: 'Rejected' }))
                ];
                break;
            case 'challenges':
                currentTabItems = challenges.map(c => ({ approvalStatus: c.approvalStatus || 'Pending' }));
                break;
            case 'ideas':
                currentTabItems = ideas.map(i => ({ approvalStatus: i.approvalStatus || 'Pending' }));
                break;
            default: return { all: 0, pending: 0, approved: 0, rejected: 0 };
        }

        return {
            all: currentTabItems.length,
            pending: currentTabItems.filter(i => i.approvalStatus === 'Pending').length,
            approved: currentTabItems.filter(i => i.approvalStatus === 'Approved').length,
            rejected: currentTabItems.filter(i => i.approvalStatus === 'Rejected').length
        };
    };

    const subCounts = getSubFilterCounts();

    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 36px 60px' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #fff, var(--accent-teal))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    <Zap size={28} style={{ color: 'var(--accent-teal)' }} /> Control Center
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
                    Review and manage registrations, challenges, and ideas — all pending actions at a glance.
                </p>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="stat-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(232, 167, 88, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-orange)' }}>{stats.pending}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Actions</div>
                    </div>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="stat-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(102, 187, 106, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-green)' }}>{stats.approved}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Approved</div>
                    </div>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="stat-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 83, 80, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}>
                        <XCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-red)' }}>{stats.rejected}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rejected</div>
                    </div>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="stat-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(171, 71, 188, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-purple)' }}>{stats.totalUsers}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Registered Users</div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                    {[
                        { id: 'pending', label: 'Pending Review', count: stats.pending },
                        { id: 'registrations', label: 'Registrations' },
                        { id: 'challenges', label: 'Challenges' },
                        { id: 'ideas', label: 'Ideas' },
                        { id: 'history', label: 'History' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setSubFilter('all'); }}
                            style={{
                                padding: '16px 4px',
                                background: 'none',
                                border: 'none',
                                color: activeTab === tab.id ? 'var(--accent-teal)' : 'var(--text-muted)',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                borderBottom: activeTab === tab.id ? '2px solid var(--accent-teal)' : '2px solid transparent',
                                marginBottom: '-2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && <span className="badge-v2">{tab.count}</span>}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '280px', marginBottom: '10px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search control center..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                    />
                </div>
            </div>

            {/* Sub Filters */}
            {activeTab !== 'pending' && activeTab !== 'history' && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button onClick={() => setSubFilter('all')} className={`sub-filter ${subFilter === 'all' ? 'active' : ''}`}>All ({subCounts.all})</button>
                    <button onClick={() => setSubFilter('pending')} className={`sub-filter ${subFilter === 'pending' ? 'active' : ''}`}><Clock size={14} /> Pending ({subCounts.pending})</button>
                    <button onClick={() => setSubFilter('approved')} className={`sub-filter ${subFilter === 'approved' ? 'active' : ''}`}><CheckCircle size={14} /> Approved ({subCounts.approved})</button>
                    <button onClick={() => setSubFilter('rejected')} className={`sub-filter ${subFilter === 'rejected' ? 'active' : ''}`}><XCircle size={14} /> Rejected ({subCounts.rejected})</button>
                </div>
            )}

            {/* Action Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredItems.length > 0 ? (
                    filteredItems.map((item: any) => (
                        <div key={item.id || item.email} className={`action-card ${item.approvalStatus === 'Approved' ? 'approved' :
                            item.approvalStatus === 'Rejected' ? 'rejected' : 'pending'
                            }`} style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                            <div className={`action-type-icon ${(item.type || activeTab).slice(0, 3)}`} style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: (item.type || activeTab) === 'registration' ? 'var(--accent-purple)' :
                                    (item.type || activeTab) === 'challenge' ? 'var(--accent-orange)' : 'var(--accent-teal)'
                            }}>
                                {(item.type || activeTab) === 'registration' && <User size={22} />}
                                {(item.type || activeTab) === 'challenge' && <Flag size={22} />}
                                {(item.type || activeTab) === 'idea' && <Lightbulb size={22} />}
                                {activeTab === 'history' && <History size={22} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                                    {activeTab === 'history' ? item.action : (item.name || item.title)}
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {item.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {item.email}</span>}
                                    {item.opco && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} /> {item.opco}</span>}
                                    {item.itemName && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Filter size={14} /> {item.itemName}</span>}
                                    {(item.type === 'challenge' || activeTab === 'challenges') && item.impact && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> {item.impact}</span>}
                                    {(item.type === 'idea' || activeTab === 'ideas') && item.impactLevel && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} /> {item.impactLevel}</span>}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : item.rejectedAt ? new Date(item.rejectedAt).toLocaleString() : 'Recently'}
                                </div>
                            </div>

                            <div className={`action-status ${(item.approvalStatus || item.status) === 'Approved' || (item.status === 'Accepted') ? 'approved-status' :
                                (item.approvalStatus || item.status) === 'Rejected' || (item.status === 'Declined') ? 'rejected-status' : 'pending-status'
                                }`}>
                                {item.approvalStatus || (item.status === 'Accepted' ? 'Approved' : item.status === 'Declined' ? 'Rejected' : 'Pending')}
                            </div>

                            {(!item.approvalStatus || item.approvalStatus === 'Pending') && activeTab !== 'history' && (
                                <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                                    <button
                                        className="btn-approve-vivid"
                                        onClick={() => openModal('approve', item.type || (activeTab as any), item.name || item.title || item.email, item.id || item.email)}
                                    >Approve</button>
                                    <button
                                        className="btn-reject-vivid"
                                        onClick={() => openModal('reject', item.type || (activeTab as any), item.name || item.title || item.email, item.id || item.email)}
                                    >Reject</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        <Shield size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>No {activeTab} items found matching your filter.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {modalConfig.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Confirm {modalConfig.action === 'approve' ? 'Approval' : 'Rejection'}</h3>
                        <p>Are you sure you want to {modalConfig.action} the following {modalConfig.type}?</p>

                        <div className="modal-item-highlight">
                            <strong>{modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1)}:</strong> {modalConfig.itemName}
                        </div>

                        <textarea
                            placeholder="Add a note or reason (optional)..."
                            value={modalConfig.reason}
                            onChange={(e) => setModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                        />

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancel"
                                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn-confirm-${modalConfig.action}`}
                                onClick={handleConfirmAction}
                            >
                                {modalConfig.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
