import React, { useState, useEffect } from 'react';
import { Flag, Lightbulb, TrendingUp, Clock, Users, UserCheck } from 'lucide-react';
import { metricsService } from '../services/metrics.service';

/* ── Static configuration for Heatmap & UI mapping ──────────────── */
const HEATMAP_ROWS = [
    [1, 2, 0, 3, 1, 4],
    [0, 3, 1, 2, 4, 0],
    [2, 0, 4, 1, 3, 2],
    [3, 1, 2, 4, 0, 3],
    [0, 2, 3, 0, 1, 4],
];

// Helper colors
const STAGE_COLORS: Record<string, string> = {
    'submitted': '#ef5350',
    'ideation': '#ffa726',
    'pilot': '#42a5f5',
    'completed': '#66bb6a',
    'archive': '#ffd54f'
};

const PLATFORM_GRADIENTS = [
    'var(--accent-orange)',
    'var(--accent-blue)',
    'var(--accent-purple)',
    'var(--accent-green)',
    'var(--accent-grey)'
];

const PORTFOLIO_MAPPING: Record<string, { x: number, y: number, color: string }> = {
    'Customer Value Driver': { x: 25, y: 80, color: '#66bb6a' },
    'Tech Enabler': { x: 75, y: 70, color: '#42a5f5' },
    'Non Strategic Product Management': { x: 50, y: 45, color: '#ffa726' },
    'Maintenance': { x: 20, y: 30, color: '#ef5350' },
};

export const Metrics: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [kpis, setKpis] = useState<any[]>([]);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [scatterData, setScatterData] = useState<any[]>([]);
    const [lineData, setLineData] = useState<number[]>([]);
    const [lineLabels, setLineLabels] = useState<string[]>([]);
    const [radarData, setRadarData] = useState<{ axis: string[], data: number[] }>({ axis: [], data: [] });
    const [activeContributors, setActiveContributors] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    summaryRes,
                    throughputRes,
                    funnelRes,
                    teamRes,
                    portfolioRes,
                    opcoRes
                ] = await Promise.all([
                    metricsService.getSummary(),
                    metricsService.getThroughput(), // Innovation velocity
                    metricsService.getFunnel(),
                    metricsService.getTeamEngagement(),
                    metricsService.getPortfolioBalance(),
                    metricsService.getOpcoRadar()
                ]);

                // 1. KPIs
                const summary = summaryRes.data.summary;
                setActiveContributors(summary.activeContributions);
                setKpis([
                    { label: 'Total Challenges', value: summary.totalChallenges, icon: <Flag size={20} /> },
                    { label: 'Ideas Generated', value: summary.totalIdeas, icon: <Lightbulb size={20} /> },
                    { label: 'Conversion Rate', value: `${summary.conversionRate}%`, icon: <TrendingUp size={20} /> },
                    { label: 'Avg. Time to Pilot', value: `${summary.averageTimeToPilot}d`, icon: <Clock size={20} /> },
                    { label: 'Total Users', value: summary.totalUsers, icon: <Users size={20} /> },
                    { label: 'Active Contributors', value: summary.activeContributions, icon: <UserCheck size={20} /> },
                ]);

                // 2. Funnel
                const fData = funnelRes.data.funnel;
                const stagesList = ['submitted', 'ideation', 'pilot', 'completed', 'archive'];
                const maxCount = Math.max(...Object.values(fData.challengesBySwimLane as Record<string, number>), 1);

                const mappedFunnel = stagesList.map(stage => ({
                    label: stage.charAt(0).toUpperCase() + stage.slice(1),
                    sub: 'Stage',
                    count: fData.challengesBySwimLane[stage] || 0,
                    color: STAGE_COLORS[stage] || '#ccc',
                    pct: ((fData.challengesBySwimLane[stage] || 0) / maxCount) * 100
                }));
                setFunnelData({
                    stages: mappedFunnel,
                    conversionRate: fData.conversionRate,
                    target: fData.targetConversionRate
                });

                // 3. Team Engagement Leaderboard
                const pData = teamRes.data.teamEngagement.challengesByPlatform as Record<string, number>;
                const sortedPlatforms = Object.entries(pData).sort((a, b) => b[1] - a[1]);
                const maxPlat = sortedPlatforms[0]?.[1] || 1;

                setLeaderboard(sortedPlatforms.slice(0, 5).map(([name, count], i) => ({
                    rank: i + 1,
                    name,
                    count,
                    pct: (count / maxPlat) * 100,
                    gradient: PLATFORM_GRADIENTS[i % PLATFORM_GRADIENTS.length],
                    color: PLATFORM_GRADIENTS[i % PLATFORM_GRADIENTS.length]
                })));

                // 4. Portfolio Scatter
                const portData = portfolioRes.data.portfolioBalance.challengesByPortfolioLane as Record<string, number>;
                setScatterData(Object.entries(portData).map(([lane, count], i) => {
                    const mapping = PORTFOLIO_MAPPING[lane] || { x: 50, y: 50, color: '#999' };
                    return {
                        id: i,
                        name: lane,
                        x: mapping.x,
                        y: mapping.y,
                        size: Math.max(10, count * 5), // Scale size by count
                        color: mapping.color
                    };
                }));

                // 5. Line Chart (Velocity)
                const velData = throughputRes.data.velocity || [];
                const mos = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                setLineData(velData.map((d: any) => d.challenges > 0 ? (d.ideas / d.challenges) : d.ideas));
                setLineLabels(velData.map((d: any) => mos[d.month - 1]));

                // 6. OpCo Radar
                const oData = opcoRes.data.opcoRadar.challengesByOpco as Record<string, number>;
                const oKeys = Object.keys(oData);
                const maxOpco = Math.max(...Object.values(oData), 1);
                setRadarData({
                    axis: oKeys.length > 0 ? oKeys : ['None'],
                    data: oKeys.length > 0 ? Object.values(oData).map(v => (v / maxOpco) * 100) : [0]
                });

            } catch (err) {
                console.error("Failed to load metrics", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`metrics-page-main ${!isLoading ? 'fade-in' : ''}`}>
            <header className="metrics-header-block">
                <h1>Executive Metrics</h1>
                <p className="metrics-subtitle">Innovation Pipeline & Strategic Alignment</p>
            </header>

            {/* ──── KPI Summary Strip ──── */}
            <div className="metrics-kpi-strip">
                {kpis.map((kpi) => (
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
                                {funnelData?.stages.map((s: any) => (
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
                                    <span className="m-conv-title">Conversion: Submitted → Completed</span>
                                    <span className="m-conv-target">Target: {funnelData?.target}%</span>
                                </div>
                                <div className="m-conv-row">
                                    <span className="m-conv-value" style={{ color: 'var(--accent-teal)' }}>{funnelData?.conversionRate}%</span>
                                    <div className="m-conv-bar">
                                        <div
                                            className="m-conv-fill animate-funnel-bar"
                                            style={{
                                                width: `${Math.min(funnelData?.conversionRate * (100 / funnelData?.target), 100)}%`,
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
                                <div className="engagement-hero-count">{activeContributors}</div>
                                <div className="engagement-hero-label">Active Contributors</div>
                                <div className="engagement-hero-sub">Recent engagements</div>
                            </div>

                            <div className="m-section-title">Platform Leaderboard</div>
                            <div className="engagement-lb">
                                {leaderboard.map(d => (
                                    <div key={d.name} className="lb-row">
                                        <span className="lb-rank">#{d.rank}</span>
                                        <span className="lb-name" title={d.name}>{d.name}</span>
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
                                {HEATMAP_ROWS.flat().map((level, i) => (
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
                            <>
                                <svg viewBox="0 0 400 150" className="line-chart-svg">
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line x1="0" y1="25" x2="400" y2="25" stroke="var(--border)" strokeDasharray="4" />
                                    <line x1="0" y1="75" x2="400" y2="75" stroke="var(--border)" strokeDasharray="4" />
                                    <line x1="0" y1="125" x2="400" y2="125" stroke="var(--border)" strokeDasharray="4" />

                                    {/* Area Path */}
                                    {lineData.length > 0 && (
                                        <path
                                            d={`M0,150 ${lineData.map((v, i) => `L${(i / (lineData.length - 1)) * 400},${150 - ((v || 0) * 25)}`).join(' ')} L400,150 Z`}
                                            fill="url(#lineGrad)"
                                        />
                                    )}
                                    {/* Line Path */}
                                    {lineData.length > 0 && (
                                        <path
                                            d={`M0,${150 - ((lineData[0] || 0) * 25)} ${lineData.map((v, i) => `L${(i / (lineData.length - 1)) * 400},${150 - ((v || 0) * 25)}`).join(' ')}`}
                                            fill="none"
                                            stroke="var(--accent-gold)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    )}
                                    {/* Points */}
                                    {lineData.map((v, i) => (
                                        <circle
                                            key={i}
                                            cx={lineData.length > 1 ? (i / (lineData.length - 1)) * 400 : 200}
                                            cy={150 - ((v || 0) * 25)}
                                            r="3"
                                            fill="#fff"
                                            stroke="var(--accent-gold)"
                                            strokeWidth="2"
                                        />
                                    ))}
                                </svg>
                                <div className="line-chart-labels">
                                    {lineLabels.map(l => <span key={l}>{l}</span>)}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. Scatter Plot: Portfolio Balance */}
                <div className="m-chart-panel scatter-graph">
                    <div className="m-chart-header">
                        <h3>Portfolio Balance</h3>
                        <p>Value (Y) vs. Effort (X)</p>
                    </div>
                    <div className="m-chart-body">
                        {isLoading ? (
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        ) : (
                            <svg viewBox="0 0 300 200" className="scatter-svg">
                                {/* Axes */}
                                <line x1="40" y1="170" x2="280" y2="170" stroke="var(--border)" strokeWidth="1" />
                                <line x1="40" y1="20" x2="40" y2="170" stroke="var(--border)" strokeWidth="1" />

                                {/* Labels */}
                                <text x="280" y="185" fontSize="9" fill="var(--text-muted)" textAnchor="end">High Effort →</text>
                                <text x="30" y="20" fontSize="9" fill="var(--text-muted)" transform="rotate(-90 30,20)" textAnchor="end">High Value →</text>

                                {/* Bubbles */}
                                {scatterData.map(item => (
                                    <g key={item.id} className="scatter-bubble-group">
                                        <circle
                                            cx={40 + (item.x / 100) * 240}
                                            cy={170 - (item.y / 100) * 150}
                                            r={item.size / 2}
                                            fill={item.color}
                                            opacity="0.8"
                                            stroke="#fff"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={40 + (item.x / 100) * 240}
                                            y={170 - (item.y / 100) * 150 - (item.size / 2) - 4}
                                            fontSize="7"
                                            fill="var(--text-primary)"
                                            textAnchor="middle"
                                            fontWeight="600"
                                        >
                                            {item.name} ({item.size / 5})
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        )}
                    </div>
                </div>

                {/* 3. Tech Radar */}
                <div className="m-chart-panel radar-graph">
                    <div className="m-chart-header">
                        <h3>OpCo Radar</h3>
                        <p>Platform Engagement</p>
                    </div>
                    <div className="m-chart-body">
                        {isLoading ? (
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        ) : (
                            <svg viewBox="0 0 200 200" className="radar-svg">
                                <defs>
                                    <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
                                    </radialGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {/* Polygon Web Grids (4 Axis = Square grids) */}
                                {[0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
                                    const r = 75 * scale;
                                    return (
                                        <polygon
                                            key={scale}
                                            points={radarData.axis.map((_, i) => {
                                                const angle = (Math.PI * 2 * i) / radarData.axis.length - Math.PI / 2;
                                                return `${100 + Math.cos(angle) * r},${100 + Math.sin(angle) * r}`;
                                            }).join(' ')}
                                            fill="none"
                                            stroke="var(--border)"
                                            strokeWidth="0.5"
                                            strokeDasharray="2"
                                            opacity={0.5}
                                        />
                                    );
                                })}
                                {/* Axis Lines */}
                                {radarData.axis.map((_, i) => {
                                    const angle = (Math.PI * 2 * i) / radarData.axis.length - Math.PI / 2;
                                    return (
                                        <line
                                            key={i}
                                            x1="100" y1="100"
                                            x2={100 + Math.cos(angle) * 75}
                                            y2={100 + Math.sin(angle) * 75}
                                            stroke="var(--border)"
                                            strokeWidth="0.5"
                                        />
                                    );
                                })}

                                {/* Data Polygon */}
                                {radarData.axis.length > 2 && (
                                    <polygon
                                        points={radarData.data.map((v, i) => {
                                            const angle = (Math.PI * 2 * i) / radarData.axis.length - Math.PI / 2;
                                            const r = (v / 100) * 75;
                                            const x = 100 + Math.cos(angle) * r;
                                            const y = 100 + Math.sin(angle) * r;
                                            return `${x},${y}`;
                                        }).join(' ')}
                                        fill="url(#radarGrad)"
                                        stroke="var(--accent-gold)"
                                        strokeWidth="2"
                                        filter="url(#glow)"
                                    />
                                )}

                                {/* Data Points & Labels */}
                                {radarData.data.map((v, i) => {
                                    const angle = (Math.PI * 2 * i) / radarData.axis.length - Math.PI / 2;
                                    const r = (v / 100) * 75;
                                    const x = 100 + Math.cos(angle) * r;
                                    const y = 100 + Math.sin(angle) * r;
                                    const lx = 100 + Math.cos(angle) * 92;
                                    const ly = 100 + Math.sin(angle) * 92;
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="3" fill="#fff" stroke="var(--accent-gold)" strokeWidth="2" />
                                            <text
                                                x={lx} y={ly}
                                                fontSize="9"
                                                fill="var(--text-secondary)"
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                                fontWeight="700"
                                                className="radar-label"
                                            >
                                                {radarData.axis[i]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
