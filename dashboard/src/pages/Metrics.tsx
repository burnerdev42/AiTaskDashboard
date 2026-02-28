import React from 'react';
import { Flag, Lightbulb, TrendingUp, Clock, Users, UserCheck } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
    ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';

/* ── Static Data for Panels 1-3 ──────────────── */
const FUNNEL_STAGES = [
    { label: 'Challenges', sub: 'Submitted', count: 47, color: '#ef5350', pct: 100 },
    { label: 'Ideas', sub: 'Generated', count: 82, color: '#ffa726', pct: 85 },
    { label: 'Evaluated', sub: 'Shortlisted', count: 23, color: '#ffee58', pct: 55 },
    { label: 'Prototypes', sub: 'Built', count: 12, color: '#42a5f5', pct: 38 },
    { label: 'Pilots', sub: 'Running', count: 5, color: '#66bb6a', pct: 22 },
    { label: 'Production', sub: 'Live', count: 3, color: '#ffd54f', pct: 14 },
];



const HEATMAP_ROWS = [
    [1, 2, 0, 3, 1, 4],
    [0, 3, 1, 2, 4, 0],
    [2, 0, 4, 1, 3, 2],
    [3, 1, 2, 4, 0, 3],
    [0, 2, 3, 0, 1, 4],
];

const LEADERBOARD = [
    { rank: 1, name: 'STP', count: 34, pct: 100, gradient: 'var(--accent-orange)', color: 'var(--accent-orange)' },
    { rank: 2, name: 'CTP', count: 28, pct: 82, gradient: 'var(--accent-blue)', color: 'var(--accent-blue)' },
    { rank: 3, name: 'RBP', count: 22, pct: 64, gradient: 'var(--accent-purple)', color: 'var(--accent-purple)' },
    { rank: 4, name: 'Data Platform', count: 17, pct: 50, gradient: 'var(--accent-green)', color: 'var(--accent-green)' },
    { rank: 5, name: 'Integration Hub', count: 12, pct: 36, gradient: 'var(--accent-grey)', color: 'var(--accent-grey)' },
];



// Scatter Plot Data: Portfolio Balance (Strategic Alignment)
// Y = Total Challenges, Z = Bubble Size (also Total Challenges usually, or overall volume)
const PORTFOLIO_DATA = [
    { id: 1, name: 'Customer Value Driver', challenges: 18, ideas: 42, contributors: 28, comments: 156, color: '#66bb6a' },
    { id: 2, name: 'Tech Enabler', challenges: 14, ideas: 31, contributors: 22, comments: 94, color: '#42a5f5' },
    { id: 3, name: 'Non Strategic Product Mgt', challenges: 9, ideas: 14, contributors: 12, comments: 41, color: '#ffa726' },
    { id: 4, name: 'Maintenance', challenges: 6, ideas: 8, contributors: 8, comments: 22, color: '#ef5350' },
];

// Gradient Line Data: Monthly Trends
const LINE_DATA = [
    { month: 'Sep', ratio: 1.8 },
    { month: 'Oct', ratio: 2.2 },
    { month: 'Nov', ratio: 3.5 },
    { month: 'Dec', ratio: 2.8 },
    { month: 'Jan', ratio: 4.2 },
    { month: 'Feb', ratio: 3.9 }
];

// Radar Data: OpCo Engagement
const RADAR_AXIS = ['Albert Heijn', 'GSO', 'GET', 'BecSee'];
const RADAR_DATA = [85, 65, 90, 70]; // % values

const KPI_CARDS = [
    { label: 'Total Challenges', value: '47', icon: <Flag size={20} /> },
    { label: 'Ideas Generated', value: '82', icon: <Lightbulb size={20} /> },
    { label: 'Conversion Rate', value: '6.4%', icon: <TrendingUp size={20} /> },
    { label: 'Avg. Time to Pilot', value: '67d', icon: <Clock size={20} /> },
    { label: 'Total Users', value: '152', icon: <Users size={20} /> },
    { label: 'Active Contributors', value: '64', icon: <UserCheck size={20} /> },
];

export const Metrics: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
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
                {KPI_CARDS.map((kpi) => (
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
                                {FUNNEL_STAGES.map(s => (
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
                                    <span className="m-conv-target">Target: 8%</span>
                                </div>
                                <div className="m-conv-row">
                                    <span className="m-conv-value" style={{ color: 'var(--accent-teal)' }}>6.4%</span>
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
                                <div className="engagement-hero-count">64</div>
                                <div className="engagement-hero-label">Active Contributors</div>
                                <div className="engagement-hero-sub"><span>42%</span> of ODC team</div>
                            </div>

                            <div className="m-section-title">Platform Leaderboard</div>
                            <div className="engagement-lb">
                                {LEADERBOARD.map(d => (
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
                            <ResponsiveContainer width="100%" height={150}>
                                <AreaChart data={LINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            <ResponsiveContainer width="100%" height={160}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis type="category" dataKey="name" name="Portfolio" axisLine={false} tickLine={false} tick={false} />
                                    <YAxis type="number" dataKey="challenges" name="Challenges" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 25]} />
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
                                    <Legend
                                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                                        iconType="circle"
                                    />
                                    {PORTFOLIO_DATA.map((entry, index) => (
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
                                            points={RADAR_AXIS.map((_, i) => {
                                                const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
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
                                {RADAR_AXIS.map((_, i) => {
                                    const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
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
                                <polygon
                                    points={RADAR_DATA.map((v, i) => {
                                        const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
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

                                {/* Data Points & Labels */}
                                {RADAR_DATA.map((v, i) => {
                                    const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
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
                                                {RADAR_AXIS[i]}
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
