import React from 'react';
import { Flag, Lightbulb, TrendingUp, Clock, Users, UserCheck } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
    ScatterChart, Scatter, ZAxis
} from 'recharts';
import { storage } from '../services/storage';

/* ── Static Data for Panels 1-3 ──────────────── */
export const Metrics: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hoveredOpCo, setHoveredOpCo] = React.useState<number | null>(null);

    const [funnelData, setFunnelData] = React.useState<any[]>([]);
    const [heatmapRows, setHeatmapRows] = React.useState<any[][]>([]);
    const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
    const [portfolioData, setPortfolioData] = React.useState<any[]>([]);
    const [lineData, setLineData] = React.useState<any[]>([]);
    const [radarData, setRadarData] = React.useState<number[]>([]);
    const [radarAxis, setRadarAxis] = React.useState<string[]>([]);
    const [kpiCards, setKpiCards] = React.useState<any[]>([]);
    const [convRateStr, setConvRateStr] = React.useState('0%');

    React.useEffect(() => {
        const calculateData = () => {
            const allChallenges = storage.getChallenges();
            const allIdeaDetails = storage.getIdeaDetails();
            const challengeDetails = storage.getChallengeDetails();
            const users = storage.getUsers();

            const totalC = allChallenges.length;
            const totalI = allIdeaDetails.length;

            const stageCounts = {
                'Challenge Submitted': { c: 0, i: 0 },
                'Ideation & Evaluation': { c: 0, i: 0 },
                'POC & Pilot': { c: 0, i: 0 },
                'Scaled & Deployed': { c: 0, i: 0 },
                'Parking Lot': { c: 0, i: 0 },
            };

            const portfolioCounts: Record<string, any> = {};
            const opcoCounts: Record<string, number> = {};
            const platformCounts: Record<string, number> = {};

            allChallenges.forEach(c => {
                const s = c.stage as keyof typeof stageCounts;
                if (stageCounts[s]) stageCounts[s].c++;

                // Map full details to compute radar/portfolio
                const det = challengeDetails.find(d => d.id === c.id);
                if (det) {
                    const port = det.portfolioOption || 'Uncategorized';
                    if (!portfolioCounts[port]) portfolioCounts[port] = { name: port, challenges: 0, ideas: 0, contributors: new Set(), comments: det.stats?.comments || 0 };
                    portfolioCounts[port].challenges++;
                    portfolioCounts[port].contributors.add(det.owner.name);

                    const opco = det.businessUnit || 'Global';
                    opcoCounts[opco] = (opcoCounts[opco] || 0) + 1;

                    const plat = det.department || 'General';
                    platformCounts[plat] = (platformCounts[plat] || 0) + 1;
                }
            });

            const activeContributors = new Set();
            allIdeaDetails.forEach(idea => {
                const chIndex = challengeDetails.findIndex(cd =>
                    cd.ideas && cd.ideas.some((i: any) => i.id === idea.id)
                );
                activeContributors.add(idea.owner.name);

                if (chIndex !== -1) {
                    const cd = challengeDetails[chIndex];
                    const chalId = cd.id;
                    const parentCh = allChallenges.find(c => c.id === chalId);
                    if (parentCh) {
                        const s = parentCh.stage as keyof typeof stageCounts;
                        if (stageCounts[s]) stageCounts[s].i++;
                    }

                    const port = cd.portfolioOption || 'Uncategorized';
                    if (portfolioCounts[port]) {
                        portfolioCounts[port].ideas++;
                        portfolioCounts[port].contributors.add(idea.owner.name);
                        portfolioCounts[port].comments += (idea.stats?.comments || 0);
                    }
                }
            });

            allChallenges.forEach(c => activeContributors.add(c.owner.name));

            const convRateNum = totalC > 0 ? ((stageCounts['Scaled & Deployed'].c) / totalC * 100) : 0;
            const convFormat = convRateNum.toFixed(1) + '%';
            setConvRateStr(convFormat);

            setFunnelData([
                { label: 'Challenges', sub: 'Submitted', count: stageCounts['Challenge Submitted'].c, color: '#ef5350', pct: 100 },
                { label: 'Ideas', sub: 'Generated', count: stageCounts['Challenge Submitted'].i, color: '#ffa726', pct: 85 },
                { label: 'Evaluated', sub: 'Shortlisted', count: stageCounts['Ideation & Evaluation'].c, color: '#ffee58', pct: 55 },
                { label: 'Prototypes', sub: 'Built', count: stageCounts['POC & Pilot'].i, color: '#42a5f5', pct: 38 },
                { label: 'Pilots', sub: 'Running', count: stageCounts['POC & Pilot'].c, color: '#66bb6a', pct: 22 },
                { label: 'Production', sub: 'Live', count: stageCounts['Scaled & Deployed'].c, color: '#ffd54f', pct: Math.max(convRateNum, 5) },
            ]);

            setKpiCards([
                { label: 'Total Challenges', value: totalC.toString(), icon: <Flag size={20} /> },
                { label: 'Ideas Generated', value: totalI.toString(), icon: <Lightbulb size={20} /> },
                { label: 'Conversion Rate', value: convFormat, icon: <TrendingUp size={20} /> },
                { label: 'Avg. Time to Pilot', value: '14d', icon: <Clock size={20} /> },
                { label: 'Total Users', value: users.length.toString(), icon: <Users size={20} /> },
                { label: 'Active Contributors', value: activeContributors.size.toString(), icon: <UserCheck size={20} /> },
            ]);

            const pColors = ['#66bb6a', '#42a5f5', '#ffa726', '#ef5350', '#ab47bc'];
            let cIndex = 0;
            const pData = Object.values(portfolioCounts).map((p: any, idx) => ({
                id: idx,
                name: p.name,
                challenges: p.challenges,
                ideas: p.ideas,
                contributors: p.contributors.size,
                comments: p.comments,
                color: pColors[(cIndex++) % pColors.length]
            }));
            setPortfolioData(pData);

            // Platform Leaderboard
            const sortedPlats = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
            const lbGradients = ['var(--accent-orange)', 'var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-green)', 'var(--accent-grey)'];
            const maxPlat = sortedPlats.length > 0 ? sortedPlats[0][1] : 1;

            setLeaderboard(sortedPlats.slice(0, 5).map((p, idx) => ({
                rank: idx + 1,
                name: p[0],
                count: p[1],
                pct: (p[1] / maxPlat) * 100,
                gradient: lbGradients[idx % lbGradients.length],
                color: lbGradients[idx % lbGradients.length]
            })));

            // OpCo Radar
            const axes = Object.keys(opcoCounts);
            const totalOpcoC = Object.values(opcoCounts).reduce((sum, val) => sum + val, 0) || 1;
            setRadarAxis(axes.length ? axes : ['Global']);
            setRadarData(axes.length ? axes.map(a => Math.round((opcoCounts[a] / totalOpcoC) * 100)) : [100]);

            // Mock Heatmap
            setHeatmapRows([
                [1, 2, 0, 3, 1, 4],
                [0, 3, 1, 2, 4, 0],
                [2, 0, 4, 1, 3, 2],
                [3, 1, 2, 4, 0, 3],
                [0, 2, 3, 0, 1, 4],
            ]);

            // Mock Line Data based on totals
            setLineData([
                { month: 'Sep', ratio: 1.8 },
                { month: 'Oct', ratio: 2.2 },
                { month: 'Nov', ratio: parseFloat((totalI / totalC * 0.7).toFixed(1)) || 0 },
                { month: 'Dec', ratio: parseFloat((totalI / totalC * 0.9).toFixed(1)) || 0 },
                { month: 'Jan', ratio: parseFloat((totalI / totalC * 1.2).toFixed(1)) || 0 },
                { month: 'Feb', ratio: parseFloat((totalI / totalC).toFixed(1)) || 0 }
            ]);
        };

        const timer = setTimeout(() => {
            calculateData();
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`metrics-page-main ${!isLoading ? 'fade-in' : ''}`}>
            <header className="metrics-header-block">
                <h1>Executive Metrics</h1>
                <p className="metrics-subtitle">Innovation Pipeline & Strategic Alignment</p>
            </header>

            {/* ──── KPI Summary Strip ──── */}
            <div className="metrics-kpi-strip">
                {kpiCards.map((kpi) => (
                    <div key={kpi.label} className="metrics-kpi-card">
                        <div className="kpi-icon">{kpi.icon}</div>
                        <div className="kpi-content">
                            <div className="kpi-label">{kpi.label}</div>
                            {isLoading ? (
                                <div className="skeleton-text" style={{ width: '50px', height: '24px', borderRadius: '4px', marginTop: '4px' }}></div>
                            ) : (
                                <div className="kpi-value">{kpi.value}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ──── Row 1: The Original 3 Panels ──── */}
            <div className="metrics-charts-grid" style={{ marginBottom: 32 }}>

                {/* Panel 1: Innovation Funnel */}
                <div className="m-panel funnel-panel">
                    <div className="m-panel-header">
                        <div className="m-panel-icon" style={{ background: 'rgba(232,167,88,.15)', color: 'var(--accent-teal)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line x1="7.38" y1="12" x2="13.12" y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /><line x1="14.31" y1="16" x2="2.83" y2="16" /><line x1="16.62" y1="12" x2="10.88" y2="21.94" /></svg></div>
                        <div>
                            <h2>Innovation Funnel</h2>
                            <p>Pipeline stage progression</p>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="m-panel-body">
                            <div className="funnel-chart">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="funnel-row" style={{ padding: '12px 0' }}>
                                        <div className="funnel-row-label">
                                            <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
                                            <div className="skeleton-text" style={{ width: '70px', height: '14px', borderRadius: '4px', marginLeft: '12px' }}></div>
                                        </div>
                                        <div className="funnel-row-track">
                                            <div className="skeleton" style={{ height: '32px', width: `${100 - i * 15}%`, borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="m-panel-body">
                            {/* Horizontal funnel bars */}
                            <div className="funnel-chart">
                                {funnelData.map(s => (
                                    <div key={s.label} className="funnel-row">
                                        <div className="funnel-row-label">
                                            <span className="funnel-row-count" style={{ color: s.color }}>{s.count}</span>
                                            <span className="funnel-row-name">{s.label}</span>
                                        </div>
                                        <div className="funnel-row-track">
                                            <div
                                                className="funnel-row-fill animate-funnel-bar"
                                                style={{
                                                    width: `${s.pct}%`,
                                                    background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)`,
                                                }}
                                            />
                                        </div>
                                        <div className="funnel-row-sub">{s.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Conversion */}
                            <div className="m-conversion">
                                <div className="m-conv-header">
                                    <span className="m-conv-title">Conversion: Challenge → Production</span>
                                    <span className="m-conv-target">Target: 25%</span>
                                </div>
                                <div className="m-conv-row">
                                    <span className="m-conv-value" style={{ color: 'var(--accent-teal)' }}>{convRateStr}</span>
                                    <div className="m-conv-bar">
                                        <div
                                            className="m-conv-fill animate-funnel-bar"
                                            style={{
                                                width: '80%',
                                                background: 'linear-gradient(90deg, var(--accent-teal), #42a5f5)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                {/* Panel 3: Platform Engagement */}
                <div className="m-panel engagement-panel">
                    <div className="m-panel-header">
                        <div className="m-panel-icon" style={{ background: 'rgba(255,167,38,.15)', color: '#ffa726' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                        <div>
                            <h2>Platform Engagement</h2>
                            <p>Active users per platform</p>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="m-panel-body">
                            <div className="engagement-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="skeleton" style={{ width: '60px', height: '40px', borderRadius: '8px', margin: '0 auto 8px' }}></div>
                                <div className="skeleton-text" style={{ width: '130px', height: '18px', borderRadius: '4px', margin: '0 auto 8px' }}></div>
                                <div className="skeleton-text" style={{ width: '90px', height: '14px', borderRadius: '4px', margin: '0 auto' }}></div>
                            </div>
                            <div className="engagement-lb" style={{ marginTop: '20px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="lb-row" style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <div className="skeleton-text" style={{ width: '20px', height: '14px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-text" style={{ width: '60px', height: '14px', borderRadius: '4px', marginLeft: '12px' }}></div>
                                        <div className="lb-bar-wrap" style={{ flex: 1, margin: '0 16px' }}>
                                            <div className="skeleton" style={{ height: '8px', width: `${100 - i * 18}%`, borderRadius: '4px' }}></div>
                                        </div>
                                        <div className="skeleton-text" style={{ width: '30px', height: '18px', borderRadius: '4px' }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="m-panel-body">
                            <div className="engagement-hero">
                                <div className="engagement-hero-count">{kpiCards.find(k => k.label === 'Active Contributors')?.value || "0"}</div>
                                <div className="engagement-hero-label">Active Contributors</div>
                                <div className="engagement-hero-sub"><span>Across All Platforms</span></div>
                            </div>

                            <div className="m-section-title">Platform Leaderboard</div>
                            <div className="engagement-lb">
                                {leaderboard.map(d => (
                                    <div key={d.name} className="lb-row">
                                        <span className="lb-rank">#{d.rank}</span>
                                        <span className="lb-name">{d.name}</span>
                                        <div className="lb-bar-wrap">
                                            <div className="lb-bar-fill" style={{ width: `${d.pct}%`, background: d.gradient }} />
                                        </div>
                                        <span className="lb-count">{d.count}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap Area */}
                            <div className="m-section-title" style={{ marginTop: 12, marginBottom: 8 }}>Contribution Heatmap</div>
                            <div className="heatmap-grid" style={{ gap: '2px' }}>
                                {heatmapRows.flat().map((level, i) => (
                                    <div key={i} className={`hm-cell l${level}`} style={{ width: '100%', aspectRatio: '1', borderRadius: '1px' }} />
                                ))}
                            </div>
                            <div className="hm-labels" style={{ fontSize: '9px', marginTop: '4px' }}>
                                {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(m => (
                                    <span key={m}>{m}</span>
                                ))}
                            </div>

                            {/* Activity Legend */}
                            <div className="heatmap-legend" style={{ marginTop: '8px', justifyContent: 'flex-start' }}>
                                <span className="legend-label" style={{ fontSize: '10px', opacity: 0.8 }}>Ratio:</span>
                                <div className="legend-boxes" style={{ gap: '2px' }}>
                                    <div className="legend-box" style={{ width: 8, height: 8, background: 'var(--bg-secondary)', borderRadius: 1 }}></div>
                                    <div className="legend-box hm-cell l1" style={{ width: 8, height: 8, borderRadius: 1 }}></div>
                                    <div className="legend-box hm-cell l2" style={{ width: 8, height: 8, borderRadius: 1 }}></div>
                                    <div className="legend-box hm-cell l3" style={{ width: 8, height: 8, borderRadius: 1 }}></div>
                                    <div className="legend-box hm-cell l4" style={{ width: 8, height: 8, borderRadius: 1 }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ── Row 2: Advanced Charts ── */}
            <div className="metrics-charts-grid bottom-row">
                {/* 1. Gradient Line Chart: Innovation Velocity */}
                <div className="m-chart-panel velocity-graph">
                    <div className="m-chart-header">
                        <h3>Innovation Velocity</h3>
                        <p>Ratio: Ideas/Challenge</p>
                    </div>
                    <div className="m-chart-body">
                        {isLoading ? (
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-gold)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--accent-gold)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
                                        itemStyle={{ color: 'var(--accent-gold)' }}
                                    />
                                    <Area type="monotone" dataKey="ratio" stroke="var(--accent-gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorRatio)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 2. Scatter Plot: Portfolio Balance */}
                <div className="m-chart-panel scatter-graph">
                    <div className="m-chart-header">
                        <h3>Portfolio Balance</h3>
                        <p>Total Challenges per Portfolio</p>
                    </div>
                    <div className="m-chart-body">
                        {isLoading ? (
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        type="number"
                                        dataKey="ideas"
                                        name="Ideas"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                        domain={[0, 'auto']}
                                        label={{ value: 'Ideas Generated', position: 'insideBottom', offset: -20, fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="challenges"
                                        name="Challenges"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                        domain={[0, 25]}
                                        label={{ value: 'Challenges', angle: -90, position: 'insideLeft', offset: 15, fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                                    />
                                    <ZAxis type="number" dataKey="challenges" range={[200, 800]} name="Volume" />
                                    <RechartsTooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', color: '#fff', fontSize: '12px', minWidth: '180px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                                        <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', color: data.color }}>{data.name}</div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Challenges:</span> <strong>{data.challenges}</strong></div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Ideas:</span> <strong>{data.ideas}</strong></div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Contributors:</span> <strong>{data.contributors}</strong></div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Comments:</span> <strong>{data.comments}</strong></div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    {portfolioData.map((entry, index) => (
                                        <Scatter key={`scatter-${index}`} name={entry.name} data={[entry]} fill={entry.color} />
                                    ))}
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 3. Tech Radar */}
                <div className="m-chart-panel radar-graph">
                    <div className="m-chart-header">
                        <h3>OpCo Radar</h3>
                        <p>Platform Engagement</p>
                    </div>
                    <div className="m-chart-body" style={{ position: 'relative' }}>
                        {isLoading ? (
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        ) : (
                            <div style={{ width: '100%', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0' }}>
                                <svg viewBox="0 0 400 400" className="radar-svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                    <defs>
                                        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                            <stop offset="30%" stopColor="var(--accent-gold)" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.1" />
                                        </radialGradient>
                                        <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Circular Grid Lines (Maximized Zoom) */}
                                    {[0.2, 0.4, 0.6, 0.8, 1.0].map(scale => (
                                        <circle
                                            key={scale}
                                            cx="200" cy="200"
                                            r={115 * scale}
                                            fill="none"
                                            stroke="var(--border)"
                                            strokeWidth="0.5"
                                            strokeDasharray={scale === 1.0 ? "0" : "3,3"}
                                            opacity={0.4}
                                        />
                                    ))}

                                    {/* Axis Lines */}
                                    {radarAxis.map((_, i) => {
                                        const angle = (Math.PI * 2 * i) / radarAxis.length - Math.PI / 2;
                                        return (
                                            <line
                                                key={i}
                                                x1="200" y1="200"
                                                x2={200 + Math.cos(angle) * 115}
                                                y2={200 + Math.sin(angle) * 115}
                                                stroke="var(--border)"
                                                strokeWidth="0.8"
                                                opacity={0.6}
                                            />
                                        );
                                    })}

                                    {/* Data Polygon with Glow */}
                                    <polygon
                                        points={radarData.map((v, i) => {
                                            const angle = (Math.PI * 2 * i) / radarAxis.length - Math.PI / 2;
                                            const r = (v / 100) * 115;
                                            return `${200 + Math.cos(angle) * r},${200 + Math.sin(angle) * r}`;
                                        }).join(' ')}
                                        fill="url(#radarGrad)"
                                        stroke="var(--accent-gold)"
                                        strokeWidth="2.5"
                                        filter="url(#radarGlow)"
                                        style={{ transition: 'all 0.5s ease-out' }}
                                    />

                                    {/* Center Point */}
                                    <circle cx="200" cy="200" r="2.5" fill="var(--accent-gold)" />

                                    {/* Data Points & Labels */}
                                    {radarData.map((v, i) => {
                                        const angle = (Math.PI * 2 * i) / radarAxis.length - Math.PI / 2;
                                        const r = (v / 100) * 115;
                                        const x = 200 + Math.cos(angle) * r;
                                        const y = 200 + Math.sin(angle) * r;

                                        // Push labels further out depending on their angle to avoid overlap
                                        // The points at the top/bottom (sin = ±1) need extra padding so they don't hit the glowing polygon points
                                        const textRadius = 140 + Math.abs(Math.sin(angle) * 20);
                                        const lx = 200 + Math.cos(angle) * textRadius;
                                        const ly = 200 + Math.sin(angle) * textRadius;

                                        const isHovered = hoveredOpCo === i;

                                        let anchor = "middle";
                                        const cosVal = Math.cos(angle);
                                        // Use a small epsilon to catch near-horizontal values as start/end
                                        if (cosVal > 0.05) anchor = "start";
                                        else if (cosVal < -0.05) anchor = "end";

                                        return (
                                            <g
                                                key={i}
                                                onMouseEnter={() => setHoveredOpCo(i)}
                                                onMouseLeave={() => setHoveredOpCo(null)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {/* Hidden larger circle for easier hovering */}
                                                <circle cx={x} cy={y} r="25" fill="transparent" />

                                                <circle
                                                    cx={x} cy={y} r={isHovered ? 10 : 5}
                                                    fill={isHovered ? "var(--accent-gold)" : "var(--bg-card)"}
                                                    stroke="var(--accent-gold)"
                                                    strokeWidth="2"
                                                    style={{ transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                                />
                                                <text
                                                    x={lx} y={ly}
                                                    fontSize={isHovered ? "18" : "15"}
                                                    fill={isHovered ? "var(--accent-gold)" : "var(--text-primary)"}
                                                    textAnchor={anchor as any}
                                                    alignmentBaseline="middle"
                                                    fontWeight={isHovered ? "800" : "600"}
                                                    style={{
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {radarAxis[i]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Interactive Tooltip Overlay */}
                                {hoveredOpCo !== null && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '1px solid var(--accent-gold)',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        pointerEvents: 'none',
                                        animation: 'fade-in 0.2s ease-out',
                                        minWidth: '120px',
                                        zIndex: 10
                                    }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Operating Co.</div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-gold)' }}>{radarAxis[hoveredOpCo]}</div>
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${radarData[hoveredOpCo]}%`, height: '100%', background: 'var(--accent-gold)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{radarData[hoveredOpCo]}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
