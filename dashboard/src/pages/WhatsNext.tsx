import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PIPELINE_STAGES = [
    {
        id: 'submitted',
        label: 'Challenge Submitted',
        count: 42,
        sub: 'Challenges submitted',
        color: 'var(--accent-red)',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg>
    },
    {
        id: 'ideation',
        label: 'Ideation & Evaluation',
        count: 28,
        sub: 'To be Evaluated',
        color: 'var(--accent-yellow)',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
    {
        id: 'poc',
        label: 'POC & Pilot',
        count: 12,
        sub: 'Prototypes running',
        color: 'var(--accent-blue)',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    },
    {
        id: 'scaled',
        label: 'Scaled & Deployed',
        count: 5,
        sub: 'In production',
        color: 'var(--accent-gold)',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
    },
    {
        id: 'parked',
        label: 'Parking Lot',
        count: 3,
        sub: 'Items parked',
        color: 'var(--accent-grey)',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
    }
];

const ROADMAP_DATA = [
    {
        q: 'Q1',
        label: 'Q1 · 2026',
        dates: 'January – March 2026',
        color: 'var(--accent-teal)',
        delay: '.1s',
        features: [
            { id: 'f1', title: 'Agentic AI Co-Pilot', team: 'AI & Platform Team', accent: 'teal', progress: '75%', desc: 'An intelligent AI assistant embedded into the pipeline — auto-suggests solutions for challenges, drafts idea proposals, and connects innovators with relevant past solutions.', badges: [{ label: 'AI', type: 'ai' }, { label: 'New', type: 'new' }] },
            { id: 'f2', title: 'Advanced Analytics Dashboard v2', team: 'Data & Visualization Team', accent: 'green', progress: '60%', desc: 'Revamped metrics dashboard with real-time KPIs, drill-down charts, innovation health scores, and predictive trend analysis for leadership visibility.', badges: [{ label: 'Upgrade', type: 'upgrade' }] },
            { id: 'f3', title: 'Smart Notification Engine', team: 'Platform Engineering', accent: 'orange', progress: '85%', desc: 'Context-aware notifications powered by ML — get notified only about what matters. Includes digest mode, priority scoring, and Slack/Teams integration.', badges: [{ label: 'Upgrade', type: 'upgrade' }, { label: 'AI', type: 'ai' }] }
        ]
    },
    {
        q: 'Q2',
        label: 'Q2 · 2026',
        dates: 'April – June 2026',
        color: 'var(--accent-blue)',
        delay: '.3s',
        features: [
            { id: 'f4', title: 'Gamification & Rewards System', team: 'Product & UX Team', accent: 'blue', progress: '35%', desc: 'Earn XP, badges, and leaderboard rankings for submitting ideas, mentoring, reviewing, and prototyping. Integrated with the Ananta badge system and redeemable rewards.', badges: [{ label: 'New', type: 'new' }] },
            { id: 'f5', title: 'Cross-Team Collaboration Hub', team: 'Collaboration Squad', accent: 'purple', progress: '20%', desc: 'Break down silos with a shared workspace — cross-ODC ideation boards, joint challenge ownership, and real-time co-authoring on innovation proposals.', badges: [{ label: 'New', type: 'new' }, { label: 'Beta', type: 'beta' }] },
            { id: 'f6', title: 'Ananta Mobile App', team: 'Mobile Engineering', accent: 'pink', progress: '10%', desc: 'Submit ideas on-the-go, vote, get real-time updates, and attend virtual innovation sprints — all from a native mobile experience on iOS and Android.', badges: [{ label: 'New', type: 'new' }, { label: 'Product', type: 'product' }] }
        ]
    },
    {
        q: 'Q3',
        label: 'Q3 · 2026',
        dates: 'July – September 2026',
        color: 'var(--accent-purple)',
        delay: '.5s',
        features: [
            { id: 'f7', title: 'Innovation Sandbox / Playground', team: 'DevOps & Infra', accent: 'purple', progress: '5%', desc: 'On-demand cloud sandboxes to prototype and demo ideas — pre-configured with AI frameworks, databases, and CI/CD. Spin up, build, present, done.', badges: [{ label: 'New', type: 'new' }, { label: 'Infra', type: 'infra' }] },
            { id: 'f8', title: 'Challenge Auto-Matcher', team: 'AI & Platform Team', accent: 'teal', progress: 'Planned', desc: 'AI-driven matching engine that recommends relevant challenges to individuals based on their skills, past contributions, interests, and team context.', badges: [{ label: 'AI', type: 'ai' }, { label: 'Beta', type: 'beta' }] }
        ]
    },
    {
        q: 'Q4',
        label: 'Q4 · 2026',
        dates: 'October – December 2026',
        color: 'var(--accent-green)',
        delay: '.7s',
        features: [
            { id: 'f9', title: 'Multi-ODC Global Rollout', team: 'Platform & Leadership', accent: 'green', progress: 'Planned', desc: 'Bring Ananta to every ODC worldwide — multi-tenant architecture, localised dashboards, region-specific challenges, and unified global leaderboard.', badges: [{ label: 'New', type: 'new' }, { label: 'Infra', type: 'infra' }] },
            { id: 'f10', title: 'Innovation ROI Tracker', team: 'Analytics & Strategy', accent: 'red', progress: 'Planned', desc: 'Measure the real business impact of every implemented idea — cost savings, revenue uplift, efficiency gains — with automated data collection and executive reporting.', badges: [{ label: 'New', type: 'new' }] }
        ]
    }
];

export const WhatsNext: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).style.opacity = '1';
                        (entry.target as HTMLElement).style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.feature-card, .product-card, .funnel-stage');
        elements.forEach((el) => {
            (el as HTMLElement).style.opacity = '0';
            (el as HTMLElement).style.transform = 'translateY(20px)';
            (el as HTMLElement).style.transition = 'opacity .5s ease, transform .5s ease';
            observerRef.current?.observe(el);
        });

        return () => {
            clearTimeout(timer);
            observerRef.current?.disconnect();
        };
    }, [isLoading]);

    return (
        <div className={`whats-next-page ${!isLoading ? 'fade-in' : ''}`}>
            {/* ═══ HERO BANNER ═══ */}
            <section className="hero-banner">
                <div className="hero-eyebrow">The Road Ahead</div>
                <h2>What's Next in Ananta</h2>
                <p className="hero-subtitle">
                    A glimpse into the upcoming features, products, and innovations being brewed at Ananta.
                    From AI-powered tooling to next-gen platform capabilities — here's what's on the horizon.
                </p>
            </section>

            <main>
                {/* ═══ ROADMAP TIMELINE ═══ */}
                <section className="timeline-section">
                    <div className="section-header">
                        <span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg></span>
                        <h2>Feature Roadmap — 2026</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="roadmap-timeline">
                        {ROADMAP_DATA.map((quarter) => (
                            <div key={quarter.q} className={`timeline-quarter ${!isLoading ? 'animate-in' : ''}`} style={{ animationDelay: quarter.delay }}>
                                <div className={`quarter-marker ${quarter.q.toLowerCase()}`}>{quarter.q}</div>
                                <div className="quarter-label" style={{ color: quarter.color }}>{quarter.label}</div>
                                <div className="quarter-dates">{quarter.dates}</div>
                                <div className="quarter-cards">
                                    {isLoading ? (
                                        [1, 2].map((i) => (
                                            <div key={i} className="roadmap-card-skeleton skeleton-shimmer">
                                                <div className="skeleton-text" style={{ width: '60%', height: '24px' }}></div>
                                                <div className="skeleton-text" style={{ width: '90%', height: '16px' }}></div>
                                                <div className="skeleton-text" style={{ width: '80%', height: '16px' }}></div>
                                                <div className="feature-meta" style={{ marginTop: 'auto' }}>
                                                    <div className="skeleton-text" style={{ width: '40%', height: '14px' }}></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        quarter.features.map((feature) => (
                                            <div key={feature.id} className="feature-card" data-accent={feature.accent}>
                                                <div className="feature-top">
                                                    <div className="feature-info">
                                                        <h4>{feature.title}</h4>
                                                        <div className="feature-badges">
                                                            {feature.badges.map((badge, idx) => (
                                                                <span key={idx} className={`feature-badge ${badge.type}`}>{badge.label}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="feature-desc">{feature.desc}</p>
                                                <div className="feature-meta">
                                                    <div className="feature-team">
                                                        <span className="feature-team-dot" style={{ background: `var(--accent-${feature.accent})` }}></span>
                                                        {feature.team}
                                                    </div>
                                                    <div className="feature-progress">
                                                        <div className="progress-bar-sm">
                                                            <div className="progress-fill-sm" style={{ width: feature.progress === 'Planned' ? '0%' : feature.progress, background: `var(--accent-${feature.accent})` }}></div>
                                                        </div>
                                                        {feature.progress}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ UPCOMING PRODUCTS ═══ */}
                <section className="products-section">
                    <div className="section-header">
                        <span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></span>
                        <h2>Upcoming Products from Ananta</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="products-grid">
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="product-card-skeleton skeleton-shimmer">
                                    <div className="skeleton-text" style={{ width: '50%', height: '28px', marginBottom: '8px' }}></div>
                                    <div className="skeleton-text" style={{ width: '80%', height: '16px', marginBottom: '20px' }}></div>
                                    <div className="skeleton-text" style={{ width: '100%', height: '60px', marginBottom: '20px' }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[1, 2, 3, 4].map(j => (
                                            <div key={j} className="skeleton-text" style={{ width: '70%', height: '14px' }}></div>
                                        ))}
                                    </div>
                                    <div className="product-footer" style={{ marginTop: 'auto' }}>
                                        <div className="skeleton-text" style={{ width: '30%', height: '18px' }}></div>
                                        <div className="skeleton-text" style={{ width: '40%', height: '18px' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {/* Product 1 — Cortex */}
                                <div className="product-card" data-accent="purple">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Cortex</h3>
                                            <div className="product-tagline">Enterprise Knowledge Intelligence</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        An AI-powered knowledge management platform that ingests documents, wikis, and code repositories
                                        to create a searchable organizational brain. Ask questions in natural language, get answers with citations.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-purple)' }}></span> RAG-based document Q&amp;A</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-purple)' }}></span> Multi-source knowledge graph</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-purple)' }}></span> Role-based access control</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-purple)' }}></span> Integrates with Confluence, SharePoint, Git</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status alpha">Alpha</span>
                                        <span className="product-eta">ETA: Q2 2026</span>
                                    </div>
                                </div>

                                {/* Product 2 — Forge */}
                                <div className="product-card" data-accent="teal">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Forge</h3>
                                            <div className="product-tagline">Rapid Prototype Builder</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        A low-code/no-code platform for quickly building functional prototypes of innovation ideas.
                                        Drag-and-drop UI, pre-built API connectors, and one-click deployment for demos.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-teal)' }}></span> Visual workflow designer</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-teal)' }}></span> 50+ pre-built connectors</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-teal)' }}></span> Auto-generate REST APIs</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-teal)' }}></span> One-click cloud deployment</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status in-dev">In Development</span>
                                        <span className="product-eta">ETA: Q3 2026</span>
                                    </div>
                                </div>

                                {/* Product 3 — Shield */}
                                <div className="product-card" data-accent="green">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Shield</h3>
                                            <div className="product-tagline">AI-Powered Code Quality Gate</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        Automated code review and security scanning tool that leverages AI to detect vulnerabilities,
                                        enforce best practices, and provide actionable fix suggestions before merge.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-green)' }}></span> Real-time vulnerability scanning</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-green)' }}></span> AI-suggested code fixes</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-green)' }}></span> CI/CD pipeline integration</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-green)' }}></span> Custom rule engine</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status coming-soon">Coming Soon</span>
                                        <span className="product-eta">ETA: Q3 2026</span>
                                    </div>
                                </div>

                                {/* Product 4 — Pulse */}
                                <div className="product-card" data-accent="pink">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Pulse</h3>
                                            <div className="product-tagline">Team Sentiment &amp; Innovation Health</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        Lightweight surveys and sentiment analysis engine that measures innovation culture health,
                                        team morale, and engagement. Generates actionable insights for people managers.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-pink)' }}></span> Anonymous micro-surveys</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-pink)' }}></span> NLP-powered sentiment analysis</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-pink)' }}></span> Trend dashboards for managers</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-pink)' }}></span> Integration with HR systems</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status planned">Planned</span>
                                        <span className="product-eta">ETA: Q4 2026</span>
                                    </div>
                                </div>

                                {/* Product 5 — Lens */}
                                <div className="product-card" data-accent="orange">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Lens</h3>
                                            <div className="product-tagline">Visual Process Mining</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        Process discovery and mining tool that visualizes how work actually flows through teams —
                                        identifies bottlenecks, redundancies, and automation opportunities using event logs.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-orange)' }}></span> Automated process discovery</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-orange)' }}></span> Bottleneck heat maps</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-orange)' }}></span> Conformance checking</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-orange)' }}></span> Simulation &amp; what-if analysis</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status planned">Planned</span>
                                        <span className="product-eta">ETA: Q1 2027</span>
                                    </div>
                                </div>

                                {/* Product 6 — Academy */}
                                <div className="product-card" data-accent="blue">
                                    <div className="product-header">
                                        <div className="product-title-area">
                                            <h3>Ananta Academy</h3>
                                            <div className="product-tagline">Innovation Skill-Building Platform</div>
                                        </div>
                                    </div>
                                    <p className="product-desc">
                                        A curated learning platform with micro-courses on design thinking, AI/ML, rapid prototyping,
                                        and intrapreneurship — powered by AI-personalized learning paths.
                                    </p>
                                    <ul className="product-highlights">
                                        <li><span className="dot" style={{ background: 'var(--accent-blue)' }}></span> AI-personalized learning paths</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-blue)' }}></span> Hands-on project challenges</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-blue)' }}></span> Certificate &amp; badge system</li>
                                        <li><span className="dot" style={{ background: 'var(--accent-blue)' }}></span> Peer mentorship matching</li>
                                    </ul>
                                    <div className="product-footer">
                                        <span className="product-status planned">Planned</span>
                                        <span className="product-eta">ETA: Q1 2027</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* ═══ IDEA PIPELINE FUNNEL ═══ */}
                <section className="funnel-section">
                    <div className="section-header">
                        <span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line x1="7.38" y1="12" x2="13.12" y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /><line x1="14.31" y1="16" x2="2.83" y2="16" /><line x1="16.62" y1="12" x2="10.88" y2="21.94" /></svg></span>
                        <h2>Innovation Pipeline Status</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="funnel-pipeline">
                        {PIPELINE_STAGES.map((stage) => (
                            <div key={stage.id} className="funnel-stage">
                                <div className="funnel-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stage.icon}
                                </div>
                                <h4>{stage.label}</h4>
                                {isLoading ? (
                                    <div className="skeleton-text" style={{ width: '50px', height: '28px', borderRadius: '4px', margin: '8px auto' }}></div>
                                ) : (
                                    <div className="funnel-count" style={{ color: stage.color }}>{stage.count}</div>
                                )}
                                <div className="funnel-label">{stage.sub}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ CTA BANNER ═══ */}
                <section className="cta-banner">
                    <div className="cta-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z" /></svg></div>
                    <h2>Got an Idea That Could Shape the Future?</h2>
                    <p>
                        The best innovations start with a single spark. Submit your idea, join a challenge, or collaborate
                        with fellow innovators — the pipeline is waiting for you.
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-btn primary" onClick={() => navigate('/challenges/submit')}>Submit a Challenge</button>
                        {!user && (
                            <button className="cta-btn secondary" onClick={() => navigate('/register')}>Join Ananta</button>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
