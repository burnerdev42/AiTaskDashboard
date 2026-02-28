import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, CheckCircle, XCircle, Users,
    User, Mail, Building2, Shield,
    Flag, Lightbulb, History, Link, AlertCircle, AlertTriangle
} from 'lucide-react';
import { storage } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { type User as UserType, type Challenge, type Idea, type AdminLog } from '../types';

const CountSkeleton = () => <span className="skeleton" style={{ display: 'inline-block', width: '20px', height: '14px', borderRadius: '4px', verticalAlign: 'middle' }} />;

export const AdminControlPanel: React.FC = () => {
    const { showToast } = useToast();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'pending' | 'registrations' | 'challenges' | 'ideas' | 'history'>('pending');
    const [subFilter, setSubFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'registration' | 'challenge' | 'idea'>('all');
    const [pendingTypeFilter, setPendingTypeFilter] = useState<'all' | 'registration' | 'challenge' | 'idea'>('all');
    const [pendingRegs, setPendingRegs] = useState<any[]>([]);
    const [rejectedRegs, setRejectedRegs] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
    const [searchTerm] = useState('');
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        totalUsers: 0
    });
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        const timer = setTimeout(() => {
            loadData();
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
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

        // Calculate global stats using resolved status
        const pChalls = challs.filter((c: Challenge) => c.approvalStatus === 'Pending').length;
        const pIdeas = ideList.filter((i: Idea) => {
            if (i.approvalStatus) return i.approvalStatus === 'Pending';
            return i.status === 'In Review' || i.status === 'Pending';
        }).length;

        const aChalls = challs.filter((c: Challenge) => !c.approvalStatus || c.approvalStatus === 'Approved').length;
        const aIdeas = ideList.filter((i: Idea) => {
            if (i.approvalStatus) return i.approvalStatus === 'Approved';
            return i.status === 'Accepted' || (!i.status || (i.status !== 'Declined' && i.status !== 'In Review' && i.status !== 'Pending'));
        }).length;

        const rChalls = challs.filter((c: Challenge) => c.approvalStatus === 'Rejected').length;
        const rIdeas = ideList.filter((i: Idea) => {
            if (i.approvalStatus) return i.approvalStatus === 'Rejected';
            return i.status === 'Declined';
        }).length;

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
        const { action, type, itemId, reason } = modalConfig;

        if (action === 'approve') {
            if (type === 'registration') handleApproveRegistration(itemId, reason);
            else if (type === 'challenge') handleApproveChallenge(itemId, reason);
            else if (type === 'idea') handleApproveIdea(itemId, reason);
        } else {
            if (type === 'registration') handleRejectRegistration(itemId, reason);
            else if (type === 'challenge') handleRejectChallenge(itemId, reason);
            else if (type === 'idea') handleRejectIdea(itemId, reason);
        }

        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleApproveRegistration = (email: string, reason: string) => {
        if (storage.approveRegistration(email)) {
            storage.addAdminLog({
                action: 'Approved Registration',
                itemType: 'Registration',
                itemName: email,
                adminName: currentUser?.name || 'Admin',
                status: 'Approved',
                details: reason
            });
            showToast(`Registration for ${email} has been approved.`);
        }
        loadData();
    };

    const handleRejectRegistration = (email: string, reason: string) => {
        if (storage.rejectRegistration(email)) {
            storage.addAdminLog({
                action: 'Rejected Registration',
                itemType: 'Registration',
                itemName: email,
                adminName: currentUser?.name || 'Admin',
                status: 'Rejected',
                details: reason
            });
            showToast(`Registration for ${email} has been rejected.`, 'error');
        }
        loadData();
    };

    const handleApproveChallenge = (id: string, _reason: string) => {
        if (storage.approveChallenge(id, currentUser?.name || 'Admin')) {
            showToast('Challenge approved successfully.');
        }
        loadData();
    };

    const handleRejectChallenge = (id: string, reason: string) => {
        if (storage.rejectChallenge(id, currentUser?.name || 'Admin', reason || undefined)) {
            showToast('Challenge rejected.', 'error');
        }
        loadData();
    };

    const handleApproveIdea = (id: string, _reason: string) => {
        if (storage.approveIdea(id, currentUser?.name || 'Admin')) {
            showToast('Idea approved successfully.');
        }
        loadData();
    };

    const handleRejectIdea = (id: string, reason: string) => {
        if (storage.rejectIdea(id, currentUser?.name || 'Admin', reason || undefined)) {
            showToast('Idea rejected.', 'error');
        }
        loadData();
    };

    // ── Helper: resolve the effective approval status for an item ──
    const resolveChallengeStatus = (c: Challenge): 'Pending' | 'Approved' | 'Rejected' => {
        if (c.approvalStatus) return c.approvalStatus;
        // Pre-existing challenges without explicit approvalStatus are Approved
        return 'Approved';
    };

    const resolveIdeaStatus = (i: Idea): 'Pending' | 'Approved' | 'Rejected' => {
        if (i.approvalStatus) return i.approvalStatus;
        // Map from legacy status field
        if (i.status === 'Accepted') return 'Approved';
        if (i.status === 'Declined') return 'Rejected';
        if (i.status === 'In Review' || i.status === 'Pending') return 'Pending';
        // Default: pre-existing ideas without explicit status are Approved
        return 'Approved';
    };

    // ── Per-tab badge counts ──
    const getTabCounts = () => {
        const regCount = pendingRegs.length + allUsers.filter(u => u.role !== 'Admin').length + rejectedRegs.length;
        const challCount = challenges.length;
        const ideaCount = ideas.length;
        return { registrations: regCount, challenges: challCount, ideas: ideaCount };
    };
    const tabCounts = getTabCounts();

    // ── Filtering logic ──
    const getFilteredItems = () => {
        const lowerSearch = searchTerm.toLowerCase();
        let items: any[] = [];

        switch (activeTab) {
            case 'pending': {
                // Only include items that are explicitly Pending
                const pRegs = pendingRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Pending' as const }));
                const pChalls = challenges
                    .filter(c => resolveChallengeStatus(c) === 'Pending')
                    .map(c => ({ ...c, type: 'challenge', approvalStatus: 'Pending' as const }));
                const pIdeas = ideas
                    .filter(i => resolveIdeaStatus(i) === 'Pending')
                    .map(i => ({ ...i, type: 'idea', approvalStatus: 'Pending' as const }));
                let allPending = [...pRegs, ...pChalls, ...pIdeas];
                // Apply pending type filter
                if (pendingTypeFilter !== 'all') {
                    allPending = allPending.filter(item => item.type === pendingTypeFilter);
                }
                items = allPending;
                break;
            }

            case 'registrations': {
                const regPend = pendingRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Pending' as const }));
                const regApp = allUsers.filter(u => u.role !== 'Admin').map(u => ({ ...u, type: 'registration', approvalStatus: 'Approved' as const }));
                const regRej = rejectedRegs.map(r => ({ ...r, type: 'registration', approvalStatus: 'Rejected' as const }));
                items = [...regPend, ...regApp, ...regRej];
                break;
            }

            case 'challenges':
                items = challenges.map(c => ({ ...c, type: 'challenge', approvalStatus: resolveChallengeStatus(c) }));
                break;

            case 'ideas':
                items = ideas.map(i => ({ ...i, type: 'idea', approvalStatus: resolveIdeaStatus(i) }));
                break;

            case 'history': {
                let logs = adminLogs
                    .filter(log =>
                        log.action.toLowerCase().includes(lowerSearch) ||
                        log.itemName.toLowerCase().includes(lowerSearch)
                    )
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                // Apply history type filter
                if (historyFilter !== 'all') {
                    const typeMap: Record<string, string> = {
                        'registration': 'Registration',
                        'challenge': 'Challenge',
                        'idea': 'Idea'
                    };
                    logs = logs.filter(log => log.itemType === typeMap[historyFilter]);
                }

                return logs;
            }
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
        let currentTabItems: { approvalStatus: string }[] = [];
        switch (activeTab) {
            case 'registrations':
                currentTabItems = [
                    ...pendingRegs.map(() => ({ approvalStatus: 'Pending' })),
                    ...allUsers.filter(u => u.role !== 'Admin').map(() => ({ approvalStatus: 'Approved' })),
                    ...rejectedRegs.map(() => ({ approvalStatus: 'Rejected' }))
                ];
                break;
            case 'challenges':
                currentTabItems = challenges.map(c => ({ approvalStatus: resolveChallengeStatus(c) }));
                break;
            case 'ideas':
                currentTabItems = ideas.map(i => ({ approvalStatus: resolveIdeaStatus(i) }));
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

    // ── History filter counts ──
    const getHistoryFilterCounts = () => {
        const allLogs = adminLogs;
        return {
            all: allLogs.length,
            registration: allLogs.filter(l => l.itemType === 'Registration').length,
            challenge: allLogs.filter(l => l.itemType === 'Challenge').length,
            idea: allLogs.filter(l => l.itemType === 'Idea').length
        };
    };
    const historyCounts = getHistoryFilterCounts();

    // ── Helper: get card CSS class based on status ──
    const getCardClass = (item: any) => {
        const status = item.approvalStatus || item.status;
        if (status === 'Approved' || status === 'Accepted') return 'done';
        if (status === 'Rejected' || status === 'Declined') return 'rejected-card';
        return 'pending';
    };

    // ── Helper: get type icon for a type string ──
    const renderTypeIcon = (type: string) => {
        if (type === 'registration') return <User size={22} />;
        if (type === 'challenge') return <Flag size={22} />;
        if (type === 'idea') return <Lightbulb size={22} />;
        return <History size={22} />;
    };

    // ── Helper: get type icon CSS class ──
    const getTypeIconClass = (type: string) => {
        if (type === 'registration') return 'reg';
        if (type === 'challenge') return 'challenge';
        if (type === 'idea') return 'idea';
        return '';
    };

    // ── Render a single action card for items (not history) ──
    const renderItemCard = (item: any, idx: number) => {
        const type = item.type || 'unknown';
        const cardClass = getCardClass(item);
        const isPending = item.approvalStatus === 'Pending';
        const displayStatus = item.approvalStatus || 'Pending';
        const statusClass = displayStatus === 'Approved' ? 'approved-status' : displayStatus === 'Rejected' ? 'rejected-status' : 'pending-status';

        let navUrl = '';
        if (type === 'registration' && item.email) {
            navUrl = `/control-center/user/${encodeURIComponent(item.email)}`;
        } else if (type === 'challenge' && item.id) {
            navUrl = `/challenges/${item.id}`;
        } else if (type === 'idea' && item.id && item.linkedChallenge?.id) {
            navUrl = `/challenges/${item.linkedChallenge.id}/ideas/${item.id}`;
        }

        return (
            <div
                key={`${type}-${item.id || item.email || idx}`}
                className={`action-card ${cardClass}`}
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: navUrl ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1
                }}
                onClick={() => {
                    if (navUrl) navigate(navUrl);
                }}
                onMouseEnter={(e) => {
                    if (navUrl) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = 'var(--accent-teal)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (navUrl) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }
                }}
            >
                <div className={`action-type-icon ${getTypeIconClass(type)}`} style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    {renderTypeIcon(type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name || item.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {/* Registration metadata */}
                        {type === 'registration' && item.email && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {item.email}</span>
                        )}
                        {type === 'registration' && item.opco && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Building2 size={14} /> {item.opco}</span>
                        )}

                        {/* Challenge metadata */}
                        {type === 'challenge' && item.owner?.name && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {item.owner.name}</span>
                        )}
                        {type === 'challenge' && item.id && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Flag size={14} /> {item.id}</span>
                        )}
                        {type === 'challenge' && item.impact && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> {item.impact} Impact</span>
                        )}

                        {/* Idea metadata */}
                        {type === 'idea' && item.owner?.name && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {item.owner.name}</span>
                        )}
                        {type === 'idea' && item.id && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Lightbulb size={14} /> {item.id}</span>
                        )}
                        {type === 'idea' && item.linkedChallenge?.id && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Link size={14} /> {item.linkedChallenge.id}</span>
                        )}
                        {type === 'idea' && item.impactLevel && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> {item.impactLevel} Impact</span>
                        )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : item.rejectedAt ? new Date(item.rejectedAt).toLocaleString() : item.submittedDate ? new Date(item.submittedDate).toLocaleString() : 'Recently'}
                    </div>
                </div>

                <span className={`action-status ${statusClass}`}>
                    {displayStatus}
                </span>

                {isPending && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '4px', position: 'relative', zIndex: 2 }}>
                        <button
                            className="btn-approve-vivid"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal('approve', type as any, item.name || item.title || item.email, type === 'registration' ? item.email : item.id);
                            }}
                        >Approve</button>
                        <button
                            className="btn-reject-vivid"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal('reject', type as any, item.name || item.title || item.email, type === 'registration' ? item.email : item.id);
                            }}
                        >Reject</button>
                    </div>
                )}
            </div>
        );
    };

    // ── Render a history log card ──
    const renderHistoryCard = (log: AdminLog) => {
        const isApproved = log.status === 'Approved';
        const cardClass = isApproved ? 'done' : 'rejected-card';
        const statusClass = isApproved ? 'approved-status' : 'rejected-status';
        const itemType = (log.itemType || '').toLowerCase();
        const iconClass = getTypeIconClass(itemType);

        // Extract reason from itemName if present (format: "name (Note: reason)")
        let displayName = log.itemName;
        let reason = '';
        const noteMatch = log.itemName.match(/^(.*?)\s*\(Note:\s*(.*?)\)$/);
        if (noteMatch) {
            displayName = noteMatch[1];
            reason = noteMatch[2];
        }

        let navUrl = '';
        if (itemType === 'registration') {
            // Find user email safely
            const user = allUsers.find(u => u.name === displayName || u.email === displayName) ||
                pendingRegs.find(u => u.name === displayName || u.email === displayName) ||
                rejectedRegs.find(u => u.name === displayName || u.email === displayName);
            if (user?.email) navUrl = `/control-center/user/${encodeURIComponent(user.email)}`;
        } else if (itemType === 'challenge') {
            const ch = challenges.find(c => c.title === displayName);
            if (ch?.id) navUrl = `/challenges/${ch.id}`;
        } else if (itemType === 'idea') {
            const idea = ideas.find(i => i.title === displayName);
            if (idea?.id && idea.linkedChallenge?.id) navUrl = `/challenges/${idea.linkedChallenge.id}/ideas/${idea.id}`;
        }

        return (
            <div
                key={log.id}
                className={`action-card ${cardClass}`}
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: navUrl ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1
                }}
                onClick={() => {
                    if (navUrl) navigate(navUrl);
                }}
                onMouseEnter={(e) => {
                    if (navUrl) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = 'var(--accent-teal)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (navUrl) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }
                }}
            >
                <div className={`action-type-icon ${iconClass}`} style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    {renderTypeIcon(itemType)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayName} — {log.status}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {log.status === 'Approved' ? 'Approved' : 'Rejected'} by {log.adminName}
                        </span>
                        {reason && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                Reason: {reason}
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                    </div>
                </div>

                <span className={`action-status ${statusClass}`}>
                    {log.status}
                </span>
            </div>
        );
    };

    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 36px 60px' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Control Center</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
                    Review and manage registrations, challenges, and ideas — all pending actions at a glance.
                </p>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Pending Actions', value: stats.pending, color: 'var(--accent-orange)', icon: <Clock size={24} />, bg: 'rgba(255, 167, 38, 0.15)' },
                    { label: 'Approved', value: stats.approved, color: 'var(--accent-green)', icon: <CheckCircle size={24} />, bg: 'rgba(102, 187, 106, 0.15)' },
                    { label: 'Rejected', value: stats.rejected, color: 'var(--accent-red)', icon: <XCircle size={24} />, bg: 'rgba(239, 83, 80, 0.15)' },
                    { label: 'Registered Users', value: stats.totalUsers, color: 'var(--accent-purple)', icon: <Users size={24} />, bg: 'rgba(171, 71, 188, 0.15)' }
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
                        <div className="stat-icon" style={{ width: '50px', height: '50px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0, marginBottom: '4px' }}>
                            {stat.icon}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                            {isLoading ? (
                                <div className="skeleton" style={{ height: '34px', width: '48px', borderRadius: '6px' }}></div>
                            ) : (
                                <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color, lineHeight: 1.2 }}>{stat.value}</div>
                            )}
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section Tabs */}
            <div className="section-tabs" style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid var(--border)' }}>
                {[
                    { id: 'pending', label: 'Pending Review', count: stats.pending },
                    { id: 'registrations', label: 'Registrations', count: tabCounts.registrations },
                    { id: 'challenges', label: 'Challenges', count: tabCounts.challenges },
                    { id: 'ideas', label: 'Ideas', count: tabCounts.ideas },
                    { id: 'history', label: 'History' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`section-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.id as any); setSubFilter('all'); setHistoryFilter('all'); setPendingTypeFilter('all'); }}
                        style={{
                            padding: '14px 28px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: activeTab === tab.id ? 'var(--accent-teal)' : 'var(--text-muted)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {tab.label}
                        {isLoading ? (
                            <span className="skeleton" style={{ display: 'inline-flex', marginLeft: '8px', width: '24px', height: '16px', borderRadius: '10px', verticalAlign: 'middle' }}></span>
                        ) : (
                            tab.count !== undefined && tab.count > 0 && <span className="badge-v2">{tab.count}</span>
                        )}
                        {activeTab === tab.id && (
                            <span style={{
                                position: 'absolute', bottom: '-2px', left: 0, right: 0,
                                height: '2px', background: 'var(--accent-teal)', borderRadius: '2px 2px 0 0'
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ paddingTop: '24px' }}>

                {/* Sub Filters for pending review — by type */}
                {activeTab === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <button onClick={() => setPendingTypeFilter('all')} className={`sub-filter ${pendingTypeFilter === 'all' ? 'active' : ''}`}>All ({isLoading ? <CountSkeleton /> : pendingRegs.length + challenges.filter(c => resolveChallengeStatus(c) === 'Pending').length + ideas.filter(i => resolveIdeaStatus(i) === 'Pending').length})</button>
                        <button onClick={() => setPendingTypeFilter('registration')} className={`sub-filter ${pendingTypeFilter === 'registration' ? 'active' : ''}`}><User size={14} /> Registrations ({isLoading ? <CountSkeleton /> : pendingRegs.length})</button>
                        <button onClick={() => setPendingTypeFilter('challenge')} className={`sub-filter ${pendingTypeFilter === 'challenge' ? 'active' : ''}`}><Flag size={14} /> Challenges ({isLoading ? <CountSkeleton /> : challenges.filter(c => resolveChallengeStatus(c) === 'Pending').length})</button>
                        <button onClick={() => setPendingTypeFilter('idea')} className={`sub-filter ${pendingTypeFilter === 'idea' ? 'active' : ''}`}><Lightbulb size={14} /> Ideas ({isLoading ? <CountSkeleton /> : ideas.filter(i => resolveIdeaStatus(i) === 'Pending').length})</button>
                    </div>
                )}

                {/* Sub Filters for registrations / challenges / ideas */}
                {(activeTab === 'registrations' || activeTab === 'challenges' || activeTab === 'ideas') && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <button onClick={() => setSubFilter('all')} className={`sub-filter ${subFilter === 'all' ? 'active' : ''}`}>All ({isLoading ? <CountSkeleton /> : subCounts.all})</button>
                        <button onClick={() => setSubFilter('pending')} className={`sub-filter ${subFilter === 'pending' ? 'active' : ''}`}><Clock size={14} /> Pending ({isLoading ? <CountSkeleton /> : subCounts.pending})</button>
                        <button onClick={() => setSubFilter('approved')} className={`sub-filter ${subFilter === 'approved' ? 'active' : ''}`}><CheckCircle size={14} /> Approved ({isLoading ? <CountSkeleton /> : subCounts.approved})</button>
                        <button onClick={() => setSubFilter('rejected')} className={`sub-filter ${subFilter === 'rejected' ? 'active' : ''}`}><XCircle size={14} /> Rejected ({isLoading ? <CountSkeleton /> : subCounts.rejected})</button>
                    </div>
                )}

                {/* Sub Filters for history — by type */}
                {activeTab === 'history' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <button onClick={() => setHistoryFilter('all')} className={`sub-filter ${historyFilter === 'all' ? 'active' : ''}`}>All ({isLoading ? <CountSkeleton /> : historyCounts.all})</button>
                        <button onClick={() => setHistoryFilter('registration')} className={`sub-filter ${historyFilter === 'registration' ? 'active' : ''}`}><User size={14} /> Registrations ({isLoading ? <CountSkeleton /> : historyCounts.registration})</button>
                        <button onClick={() => setHistoryFilter('challenge')} className={`sub-filter ${historyFilter === 'challenge' ? 'active' : ''}`}><Flag size={14} /> Challenges ({isLoading ? <CountSkeleton /> : historyCounts.challenge})</button>
                        <button onClick={() => setHistoryFilter('idea')} className={`sub-filter ${historyFilter === 'idea' ? 'active' : ''}`}><Lightbulb size={14} /> Ideas ({isLoading ? <CountSkeleton /> : historyCounts.idea})</button>
                    </div>
                )}

                {/* Action Cards List */}
                <div key={activeTab + '-' + subFilter + '-' + historyFilter + '-' + pendingTypeFilter} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }}></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: '18px', width: '40%', marginBottom: '10px', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '6px', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ height: '12px', width: '20%', borderRadius: '4px' }}></div>
                                </div>
                                <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '20px' }}></div>
                            </div>
                        ))
                    ) : filteredItems.length > 0 ? (
                        activeTab === 'history'
                            ? (filteredItems as AdminLog[]).map(log => renderHistoryCard(log))
                            : filteredItems.map((item: any, idx: number) => renderItemCard(item, idx))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                            <Shield size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>No {activeTab} items found matching your filter.</p>
                        </div>
                    )}
                </div>
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

                        <div style={{ marginBottom: '4px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Comment {modalConfig.action === 'reject' && <span style={{ color: 'var(--accent-red, #ef5350)' }}>*</span>}
                            </label>
                        </div>
                        <textarea
                            placeholder={modalConfig.action === 'approve' ? 'Add an optional note...' : 'Add a reason for rejection (required)...'}
                            value={modalConfig.reason}
                            onChange={(e) => setModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                            style={{ borderColor: modalConfig.action === 'reject' && !modalConfig.reason.trim() ? 'var(--accent-red, #ef5350)' : undefined }}
                        />
                        {modalConfig.action === 'reject' && !modalConfig.reason.trim() && (
                            <p style={{ fontSize: '12px', color: 'var(--accent-red, #ef5350)', margin: '4px 0 0' }}>
                                A reason is required to reject.
                            </p>
                        )}

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
                                disabled={modalConfig.action === 'reject' && !modalConfig.reason.trim()}
                                style={{ opacity: modalConfig.action === 'reject' && !modalConfig.reason.trim() ? 0.5 : 1, cursor: modalConfig.action === 'reject' && !modalConfig.reason.trim() ? 'not-allowed' : 'pointer' }}
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
