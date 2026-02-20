import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const WhatsNext: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
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
            observerRef.current?.disconnect();
        };
    }, []);

    return (
        <div className="whats-next-page">
            {/* ═══ HERO BANNER ═══ */}
            <section className="hero-banner">
                <div className="hero-eyebrow">🔮 The Road Ahead</div>
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
                        <span className="icon">🗺️</span>
                        <h2>Feature Roadmap — 2026</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="roadmap-timeline">
                        {/* ── Q1 2026 ── */}
                        <div className="timeline-quarter animate-in" style={{ animationDelay: '.1s' }}>
                            <div className="quarter-marker q1">Q1</div>
                            <div className="quarter-label" style={{ color: 'var(--accent-teal)' }}>Q1 · 2026</div>
                            <div className="quarter-dates">January – March 2026</div>
                            <div className="quarter-cards">
                                <div className="feature-card" data-accent="teal">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Agentic AI Co-Pilot</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge ai">AI</span>
                                                <span className="feature-badge new">New</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        An intelligent AI assistant embedded into the pipeline — auto-suggests solutions for challenges,
                                        drafts idea proposals, and connects innovators with relevant past solutions.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-teal)' }}></span>
                                            AI &amp; Platform Team
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '75%', background: 'var(--accent-teal)' }}></div>
                                            </div>
                                            75%
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="green">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Advanced Analytics Dashboard v2</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge upgrade">Upgrade</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Revamped metrics dashboard with real-time KPIs, drill-down charts, innovation health scores,
                                        and predictive trend analysis for leadership visibility.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-green)' }}></span>
                                            Data &amp; Visualization Team
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '60%', background: 'var(--accent-green)' }}></div>
                                            </div>
                                            60%
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="orange">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Smart Notification Engine</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge upgrade">Upgrade</span>
                                                <span className="feature-badge ai">AI</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Context-aware notifications powered by ML — get notified only about what matters. Includes
                                        digest mode, priority scoring, and Slack/Teams integration.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-orange)' }}></span>
                                            Platform Engineering
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '85%', background: 'var(--accent-orange)' }}></div>
                                            </div>
                                            85%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Q2 2026 ── */}
                        <div className="timeline-quarter animate-in" style={{ animationDelay: '.3s' }}>
                            <div className="quarter-marker q2">Q2</div>
                            <div className="quarter-label" style={{ color: 'var(--accent-blue)' }}>Q2 · 2026</div>
                            <div className="quarter-dates">April – June 2026</div>
                            <div className="quarter-cards">
                                <div className="feature-card" data-accent="blue">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Gamification &amp; Rewards System</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Earn XP, badges, and leaderboard rankings for submitting ideas, mentoring, reviewing, and
                                        prototyping. Integrated with the Ananta badge system and redeemable rewards.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-blue)' }}></span>
                                            Product &amp; UX Team
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '35%', background: 'var(--accent-blue)' }}></div>
                                            </div>
                                            35%
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="purple">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Cross-Team Collaboration Hub</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                                <span className="feature-badge beta">Beta</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Break down silos with a shared workspace — cross-ODC ideation boards, joint challenge ownership,
                                        and real-time co-authoring on innovation proposals.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-purple)' }}></span>
                                            Collaboration Squad
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '20%', background: 'var(--accent-purple)' }}></div>
                                            </div>
                                            20%
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="pink">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Ananta Mobile App</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                                <span className="feature-badge product">Product</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Submit ideas on-the-go, vote, get real-time updates, and attend virtual innovation sprints —
                                        all from a native mobile experience on iOS and Android.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-pink)' }}></span>
                                            Mobile Engineering
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '10%', background: 'var(--accent-pink)' }}></div>
                                            </div>
                                            10%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Q3 2026 ── */}
                        <div className="timeline-quarter animate-in" style={{ animationDelay: '.5s' }}>
                            <div className="quarter-marker q3">Q3</div>
                            <div className="quarter-label" style={{ color: 'var(--accent-purple)' }}>Q3 · 2026</div>
                            <div className="quarter-dates">July – September 2026</div>
                            <div className="quarter-cards">
                                <div className="feature-card" data-accent="purple">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Innovation Sandbox / Playground</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                                <span className="feature-badge infra">Infra</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        On-demand cloud sandboxes to prototype and demo ideas — pre-configured with AI frameworks,
                                        databases, and CI/CD. Spin up, build, present, done.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-purple)' }}></span>
                                            DevOps &amp; Infra
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '5%', background: 'var(--accent-purple)' }}></div>
                                            </div>
                                            5%
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="teal">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Challenge Auto-Matcher</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge ai">AI</span>
                                                <span className="feature-badge beta">Beta</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        AI-driven matching engine that recommends relevant challenges to individuals based on their
                                        skills, past contributions, interests, and team context.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-teal)' }}></span>
                                            AI &amp; Platform Team
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '0%', background: 'var(--accent-teal)' }}></div>
                                            </div>
                                            Planned
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Q4 2026 ── */}
                        <div className="timeline-quarter animate-in" style={{ animationDelay: '.7s' }}>
                            <div className="quarter-marker q4">Q4</div>
                            <div className="quarter-label" style={{ color: 'var(--accent-green)' }}>Q4 · 2026</div>
                            <div className="quarter-dates">October – December 2026</div>
                            <div className="quarter-cards">
                                <div className="feature-card" data-accent="green">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Multi-ODC Global Rollout</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                                <span className="feature-badge infra">Infra</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Bring Ananta to every ODC worldwide — multi-tenant architecture, localised dashboards,
                                        region-specific challenges, and unified global leaderboard.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-green)' }}></span>
                                            Platform &amp; Leadership
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '0%', background: 'var(--accent-green)' }}></div>
                                            </div>
                                            Planned
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-card" data-accent="red">
                                    <div className="feature-top">
                                        <div className="feature-info">
                                            <h4>Innovation ROI Tracker</h4>
                                            <div className="feature-badges">
                                                <span className="feature-badge new">New</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="feature-desc">
                                        Measure the real business impact of every implemented idea — cost savings, revenue uplift,
                                        efficiency gains — with automated data collection and executive reporting.
                                    </p>
                                    <div className="feature-meta">
                                        <div className="feature-team">
                                            <span className="feature-team-dot" style={{ background: 'var(--accent-red)' }}></span>
                                            Analytics &amp; Strategy
                                        </div>
                                        <div className="feature-progress">
                                            <div className="progress-bar-sm">
                                                <div className="progress-fill-sm" style={{ width: '0%', background: 'var(--accent-red)' }}></div>
                                            </div>
                                            Planned
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ UPCOMING PRODUCTS ═══ */}
                <section className="products-section">
                    <div className="section-header">
                        <span className="icon">🚀</span>
                        <h2>Upcoming Products from Ananta</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="products-grid">
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
                                <span className="product-status alpha">⚗️ Alpha</span>
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
                                <span className="product-status in-dev">🔧 In Development</span>
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
                                <span className="product-status coming-soon">🔜 Coming Soon</span>
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
                                <span className="product-status planned">📋 Planned</span>
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
                                <span className="product-status planned">📋 Planned</span>
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
                                <span className="product-status planned">📋 Planned</span>
                                <span className="product-eta">ETA: Q1 2027</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ IDEA PIPELINE FUNNEL ═══ */}
                <section className="funnel-section">
                    <div className="section-header">
                        <span className="icon">🔬</span>
                        <h2>Innovation Pipeline Status</h2>
                        <span className="section-line"></span>
                    </div>

                    <div className="funnel-pipeline">
                        <div className="funnel-stage">
                            <div className="funnel-icon">💡</div>
                            <h4>Ideation</h4>
                            <div className="funnel-count" style={{ color: 'var(--accent-teal)' }}>42</div>
                            <div className="funnel-label">Ideas Submitted</div>
                        </div>
                        <div className="funnel-stage">
                            <div className="funnel-icon">🔍</div>
                            <h4>Evaluation</h4>
                            <div className="funnel-count" style={{ color: 'var(--accent-blue)' }}>28</div>
                            <div className="funnel-label">Under Review</div>
                        </div>
                        <div className="funnel-stage">
                            <div className="funnel-icon">🧪</div>
                            <h4>Prototyping</h4>
                            <div className="funnel-count" style={{ color: 'var(--accent-purple)' }}>12</div>
                            <div className="funnel-label">Being Built</div>
                        </div>
                        <div className="funnel-stage">
                            <div className="funnel-icon">🚀</div>
                            <h4>Piloting</h4>
                            <div className="funnel-count" style={{ color: 'var(--accent-orange)' }}>5</div>
                            <div className="funnel-label">In Pilot</div>
                        </div>
                        <div className="funnel-stage">
                            <div className="funnel-icon">🏆</div>
                            <h4>Scaled</h4>
                            <div className="funnel-count" style={{ color: 'var(--accent-green)' }}>3</div>
                            <div className="funnel-label">In Production</div>
                        </div>
                    </div>
                </section>

                {/* ═══ CTA BANNER ═══ */}
                <section className="cta-banner">
                    <div className="cta-icon">💡</div>
                    <h2>Got an Idea That Could Shape the Future?</h2>
                    <p>
                        The best innovations start with a single spark. Submit your idea, join a challenge, or collaborate
                        with fellow innovators — the pipeline is waiting for you.
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-btn primary" onClick={() => navigate('/challenges/submit')}>🚀 Submit a Challenge</button>
                        {!user && (
                            <button className="cta-btn secondary" onClick={() => navigate('/register')}>✨ Join Ananta</button>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
