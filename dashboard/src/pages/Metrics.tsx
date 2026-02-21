import React from 'react';

/* ── Static Data for Panels 1-3 ──────────────── */
const FUNNEL_STAGES = [
    { label: 'Challenges', sub: 'Submitted', count: 47, color: '#ef5350', pct: 100 },
    { label: 'Ideas', sub: 'Generated', count: 82, color: '#ffa726', pct: 85 },
    { label: 'Evaluated', sub: 'Shortlisted', count: 23, color: '#ffee58', pct: 55 },
    { label: 'Prototypes', sub: 'Built', count: 12, color: '#42a5f5', pct: 38 },
    { label: 'Pilots', sub: 'Running', count: 5, color: '#66bb6a', pct: 22 },
    { label: 'Production', sub: 'Live', count: 3, color: '#ffd54f', pct: 14 },
];

const TOP_SOLUTIONS = [
    { rank: '1st', name: 'Auto-replenish', value: '€340K', type: 'money' as const },
    { rank: '2nd', name: 'AI Quality Check', value: '35%↑', type: 'percent' as const },
    { rank: '3rd', name: 'Customer Insights', value: '12%↑', type: 'percent' as const },
];

const LEADERBOARD = [
    { medal: '1st', name: 'App Dev', count: 22, pct: 100, gradient: 'linear-gradient(90deg, #ffa726, #ffd54f)', color: '#ffa726' },
    { medal: '2nd', name: 'QE', count: 18, pct: 82, gradient: 'linear-gradient(90deg, #42a5f5, var(--accent-teal))', color: '#42a5f5' },
    { medal: '3rd', name: 'Infra', count: 14, pct: 64, gradient: 'linear-gradient(90deg, #ab47bc, #ec407a)', color: '#ab47bc' },
    { medal: '4th', name: 'Data & AI', count: 11, pct: 50, gradient: 'linear-gradient(90deg, #66bb6a, var(--accent-teal))', color: '#66bb6a', plain: true },
    { medal: '5th', name: 'DevOps', count: 8, pct: 36, gradient: 'linear-gradient(90deg, var(--accent-teal), #42a5f5)', color: 'var(--accent-teal)', plain: true },
];

const HEATMAP_ROWS = [
    [1, 2, 0, 3, 1, 4, 2, 0, 5, 3, 1, 4],
    [0, 3, 1, 2, 5, 0, 4, 1, 3, 2, 5, 0],
    [2, 0, 4, 1, 3, 5, 0, 2, 1, 4, 3, 2],
    [3, 1, 2, 5, 0, 3, 1, 4, 2, 0, 4, 5],
    [0, 2, 3, 0, 1, 2, 5, 3, 0, 1, 2, 3],
];

/* ── Static Data for New Charts ──────────────── */
// Scatter Plot Data: Value (Y) vs Effort (X) vs ROI (Size)
const SCATTER_DATA = [
    { id: 1, name: 'Auto-Replenish', x: 20, y: 85, size: 24, color: '#66bb6a' },
    { id: 2, name: 'Smart Search', x: 45, y: 70, size: 18, color: '#42a5f5' },
    { id: 3, name: 'Predictive maint.', x: 70, y: 60, size: 14, color: '#ffa726' },
    { id: 4, name: 'Chatbot', x: 30, y: 40, size: 10, color: '#ef5350' },
    { id: 5, name: 'Warehouse IoT', x: 80, y: 90, size: 28, color: '#ab47bc' },
    { id: 6, name: 'Route Opt.', x: 50, y: 55, size: 16, color: '#26c6da' },
    { id: 7, name: 'Dynamic Price', x: 15, y: 30, size: 8, color: '#78909c' },
];

// Gradient Line Data: Monthly Trends
const LINE_DATA = [12, 18, 15, 25, 32, 28, 38, 45, 42, 55, 60, 58];

// Radar Data: Tech Landscape
const RADAR_AXIS = ['AI/ML', 'Cloud', 'IoT', 'Mobile', 'Web', 'DevOps'];
const RADAR_DATA = [80, 90, 60, 40, 85, 75]; // % values

const KPI_CARDS = [
    { label: 'Total Challenges', value: '47', icon: 'CH', delta: '+8', deltaType: 'up' as const },
    { label: 'Ideas Generated', value: '82', icon: 'ID', delta: '+14', deltaType: 'up' as const },
    { label: 'Conversion Rate', value: '6.4%', icon: 'CR', delta: '+0.8%', deltaType: 'up' as const },
    { label: 'Avg. Time to Pilot', value: '67d', icon: 'TP', delta: '-5d', deltaType: 'down' as const },
    { label: 'Active Contributors', value: '64', icon: 'AC', delta: '+12', deltaType: 'up' as const },
    { label: 'Pipeline Value', value: '€2.8M', icon: 'PV', delta: '+€400K', deltaType: 'up' as const },
];

export const Metrics: React.FC = () => {
    return (
        <div className="metrics-page-main">
            <header className="metrics-header-block">
                <h1>Executive Metrics</h1>
                <p className="metrics-subtitle">Innovation Pipeline & Strategic Alignment</p>
            </header>

            {/* ──── KPI Summary Strip ──── */}
            <div className="metrics-kpi-strip">
                {KPI_CARDS.map(kpi => (
                    <div key={kpi.label} className="metrics-kpi-card">
                        <div className="kpi-icon">{kpi.icon}</div>
                        <div className="kpi-content">
                            <div className="kpi-label">{kpi.label}</div>
                            <div className="kpi-value">{kpi.value}</div>
                        </div>
                        <div className={`kpi-delta ${kpi.deltaType}`}>
                            {kpi.deltaType === 'up' ? '↑' : '↓'} {kpi.delta}
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
                                            className="funnel-row-fill"
                                            style={{
                                                width: `${s.pct}%`,
                                                background: `linear-gradient(90deg, ${s.color}, ${s.color}66)`,
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
                                    <div className="m-conv-fill" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel 2: Business Value Impact */}
                <div className="m-panel value-panel">
                    <div className="m-panel-header">
                        <div className="m-panel-icon" style={{ background: 'rgba(102,187,106,.15)', color: '#66bb6a' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                        <div>
                            <h2>Business Value</h2>
                            <p>Financial impact & ROI</p>
                        </div>
                    </div>
                    <div className="m-panel-body">
                        <div className="value-hero">
                            <div className="value-hero-label">Total Value Delivered</div>
                            <div className="value-hero-amount">€1.2M</div>
                            <div className="value-hero-period">YTD – Jan 2026</div>
                        </div>

                        <div className="value-solutions">
                            <div className="m-section-title">Top Performing Solutions</div>
                            {TOP_SOLUTIONS.map(s => (
                                <div key={s.name} className="value-sol-row">
                                    <span className="value-sol-rank">{s.rank}</span>
                                    <span className="value-sol-name">{s.name}</span>
                                    <span className={`value-sol-val ${s.type}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="value-stats-row">
                            <div className="value-stat-card">
                                <div className="value-stat-label">Avg. ROI</div>
                                <div className="value-stat-val" style={{ color: '#42a5f5' }}>3.4×</div>
                            </div>
                            <div className="value-stat-card">
                                <div className="value-stat-label">Cost Saved</div>
                                <div className="value-stat-val" style={{ color: '#66bb6a' }}>€860K</div>
                            </div>
                        </div>

                        <div className="value-pipeline">
                            <span>Pipeline Value</span>
                            <span className="value-pipeline-amount">€2.8M</span>
                        </div>
                    </div>
                </div>

                {/* Panel 3: Team Engagement */}
                <div className="m-panel engagement-panel">
                    <div className="m-panel-header">
                        <div className="m-panel-icon" style={{ background: 'rgba(255,167,38,.15)', color: '#ffa726' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                        <div>
                            <h2>Team Engagement</h2>
                            <p>Participation & activity</p>
                        </div>
                    </div>
                    <div className="m-panel-body">
                        <div className="engagement-hero">
                            <div className="engagement-hero-count">64</div>
                            <div className="engagement-hero-label">Active Contributors</div>
                            <div className="engagement-hero-sub"><span>42%</span> of ODC team</div>
                        </div>

                        <div className="m-section-title">Department Leaderboard</div>
                        <div className="engagement-lb">
                            {LEADERBOARD.map(d => (
                                <div key={d.name} className="lb-row">
                                    <span
                                        className="lb-medal"
                                        style={d.plain ? { fontSize: 13, color: 'var(--text-muted)' } : undefined}
                                    >
                                        {d.medal}
                                    </span>
                                    <span className="lb-name">{d.name}</span>
                                    <div className="lb-bar-wrap">
                                        <div className="lb-bar-fill" style={{ width: `${d.pct}%`, background: d.gradient }} />
                                    </div>
                                    <span className="lb-count" style={{ color: d.color }}>{d.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Heatmap */}
                        <div className="m-section-title" style={{ marginTop: 20 }}>Activity Heatmap (12 Weeks)</div>
                        <div className="heatmap-grid">
                            {HEATMAP_ROWS.flat().map((level, i) => (
                                <div key={i} className={`hm-cell l${level}`} />
                            ))}
                        </div>
                        <div className="hm-labels">
                            {Array.from({ length: 12 }, (_, i) => (
                                <span key={i}>W{i + 1}</span>
                            ))}
                        </div>
                        <div className="hm-legend">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4, 5].map(l => (
                                <div key={l} className={`hm-legend-cell l${l}`} style={l === 0 ? { border: '1px solid var(--border)' } : undefined} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Row 2: Advanced Charts ── */}
            <div className="metrics-charts-grid">

                {/* 1. Gradient Line Chart: Innovation Velocity */}
                <div className="m-chart-panel velocity-graph">
                    <div className="m-chart-header">
                        <h3>Innovation Velocity</h3>
                        <div className="m-chart-legend">
                            <span className="legend-dot" style={{ background: '#42a5f5' }}></span> Total Ideas
                        </div>
                    </div>
                    <div className="m-chart-body">
                        <svg viewBox="0 0 400 150" className="line-chart-svg">
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#42a5f5" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#42a5f5" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line x1="0" y1="30" x2="400" y2="30" stroke="var(--border)" strokeDasharray="4" />
                            <line x1="0" y1="75" x2="400" y2="75" stroke="var(--border)" strokeDasharray="4" />
                            <line x1="0" y1="120" x2="400" y2="120" stroke="var(--border)" strokeDasharray="4" />

                            {/* Area Path */}
                            <path
                                d={`M0,150 ${LINE_DATA.map((v, i) => `L${(i / (LINE_DATA.length - 1)) * 400},${150 - (v * 2)}`).join(' ')} L400,150 Z`}
                                fill="url(#lineGrad)"
                            />
                            {/* Line Path */}
                            <path
                                d={`M0,${150 - (LINE_DATA[0] * 2)} ${LINE_DATA.map((v, i) => `L${(i / (LINE_DATA.length - 1)) * 400},${150 - (v * 2)}`).join(' ')}`}
                                fill="none"
                                stroke="#42a5f5"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Points */}
                            {LINE_DATA.map((v, i) => (
                                <circle
                                    key={i}
                                    cx={(i / (LINE_DATA.length - 1)) * 400}
                                    cy={150 - (v * 2)}
                                    r="3"
                                    fill="#fff"
                                    stroke="#42a5f5"
                                    strokeWidth="2"
                                />
                            ))}
                        </svg>
                        <div className="line-chart-labels">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* 2. Scatter Plot: Portfolio Balance */}
                <div className="m-chart-panel scatter-graph">
                    <div className="m-chart-header">
                        <h3>Portfolio Balance</h3>
                        <p>Value (Y) vs. Effort (X)</p>
                    </div>
                    <div className="m-chart-body">
                        <svg viewBox="0 0 300 200" className="scatter-svg">
                            {/* Axes */}
                            <line x1="40" y1="170" x2="280" y2="170" stroke="var(--border)" strokeWidth="1" />
                            <line x1="40" y1="20" x2="40" y2="170" stroke="var(--border)" strokeWidth="1" />

                            {/* Labels */}
                            <text x="280" y="185" fontSize="9" fill="var(--text-muted)" textAnchor="end">High Effort →</text>
                            <text x="30" y="20" fontSize="9" fill="var(--text-muted)" transform="rotate(-90 30,20)" textAnchor="end">High Value →</text>

                            {/* Bubbles */}
                            {SCATTER_DATA.map(item => (
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
                                        {item.name}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* 3. Tech Radar */}
                <div className="m-chart-panel radar-graph">
                    <div className="m-chart-header">
                        <h3>Tech Radar</h3>
                        <p>Strategic Alignment</p>
                    </div>
                    <div className="m-chart-body">
                        <svg viewBox="0 0 200 200" className="radar-svg">
                            {/* Grid Webs */}
                            {[20, 40, 60, 80, 100].map(r => (
                                <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeDasharray="3" />
                            ))}
                            {/* Axis Lines */}
                            {RADAR_AXIS.map((_, i) => {
                                const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
                                return (
                                    <line
                                        key={i}
                                        x1="100" y1="100"
                                        x2={100 + Math.cos(angle) * 100}
                                        y2={100 + Math.sin(angle) * 100}
                                        stroke="var(--border)"
                                    />
                                );
                            })}

                            {/* Data Polygon */}
                            <polygon
                                points={RADAR_DATA.map((v, i) => {
                                    const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
                                    const x = 100 + Math.cos(angle) * v;
                                    const y = 100 + Math.sin(angle) * v;
                                    return `${x},${y}`;
                                }).join(' ')}
                                fill="rgba(66, 165, 245, 0.2)"
                                stroke="#42a5f5"
                                strokeWidth="2"
                            />

                            {/* Data Points & Labels */}
                            {RADAR_DATA.map((v, i) => {
                                const angle = (Math.PI * 2 * i) / RADAR_AXIS.length - Math.PI / 2;
                                const x = 100 + Math.cos(angle) * v;
                                const y = 100 + Math.sin(angle) * v;
                                const lx = 100 + Math.cos(angle) * 115;
                                const ly = 100 + Math.sin(angle) * 115;
                                return (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r="3" fill="#42a5f5" stroke="#fff" />
                                        <text
                                            x={lx} y={ly}
                                            fontSize="9"
                                            fill="var(--text-secondary)"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                        >
                                            {RADAR_AXIS[i]}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    );
};
