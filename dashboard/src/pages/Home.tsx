import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from '../components/ui/ChallengeCard';
import { storage } from '../services/storage';
import { type Challenge } from '../types';

import { TeamMember } from '../components/ui/TeamMember';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const isPaused = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChallenges(storage.getChallenges());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (challenges.length || 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + challenges.length) % challenges.length);
    };

    // Continuous auto-play every 5 seconds, pause on hover
    useEffect(() => {
        if (challenges.length <= 1) return;
        const timer = setInterval(() => {
            if (!isPaused.current) {
                setCurrentSlide((prev) => (prev + 1) % challenges.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [challenges.length]);

    return (
        <div className="home-dashboard-layout">
            {/* ─── HIGHLIGHTED CHALLENGES CAROUSEL ──── */}
            <section
                className="carousel-section"
                onMouseEnter={() => { isPaused.current = true; }}
                onMouseLeave={() => { isPaused.current = false; }}
            >
                <div className="carousel-header">
                    <h2><span className="icon">🌟</span> Top Rated Challenges</h2>
                    <div className="carousel-controls">
                        <button className="carousel-btn" onClick={prevSlide} aria-label="Previous">&#8249;</button>
                        <span className="carousel-indicator">{currentSlide + 1} / {challenges.length}</span>
                        <button className="carousel-btn" onClick={nextSlide} aria-label="Next">&#8250;</button>
                    </div>
                </div>

                <div className="carousel-viewport">
                    <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {challenges.map((challenge) => (
                            <div className="carousel-slide" key={challenge.id}>
                                <ChallengeCard challenge={challenge} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-dots">
                    {challenges.map((_, idx) => (
                        <button
                            key={idx}
                            className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                        />
                    ))}
                </div>
            </section>

            {/* ─── METRICS DASHBOARD ───────────────── */}
            <aside className="metrics-dashboard">
                {/* Metric Panels (Static for now as per mockup logic) */}
                <div className="metric-panel">
                    <h3>📊 Pipeline Summary</h3>
                    <div className="donut-chart">
                        <div className="donut-hole">11</div>
                    </div>
                    <div className="legend">
                        <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-gold)' }}></span> Scaled & Deployed (1)</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-blue)' }}></span> POC & Pilot (3)</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-yellow)' }}></span> Ideation & Evaluation (2)</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-red)' }}></span> Challenge Submitted (4)</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-grey)' }}></span> Parking Lot (1)</div>
                    </div>
                </div>

                <div className="metric-panel">
                    <h3>⚡ Key Metrics</h3>
                    <div className="metric-row">
                        <span className="metric-label">Avg. Idea → Pilot</span>
                        <span className="metric-value teal">42d</span>
                    </div>
                    <div className="metric-row">
                        <span className="metric-label">Pilot Success Rate</span>
                        <span className="metric-value green">78%</span>
                    </div>
                </div>

                {/* Panel 3 simplified for React without specific charting lib availability yet, matching HTML structure */}
                <div className="metric-panel">
                    <h3>📈 Monthly Throughput</h3>
                    <div className="spark-bars">
                        {[
                            { i: 80, c: 22 }, { i: 100, c: 30 },
                            { i: 85, c: 24 }, { i: 70, c: 19 }, { i: 95, c: 28 }, { i: 110, c: 35 }
                        ].map((d, idx) => (
                            <div key={idx} className="grouped-month">
                                <div className="spark-bar ideas" style={{ height: `${d.i / 1.2}%`, animationDelay: `${0.5 + idx * 0.08}s` }}></div>
                                <div className="spark-bar challenges" style={{ height: `${d.c * 2}%`, animationDelay: `${0.5 + idx * 0.08 + 0.03}s` }}></div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
                    </div>
                    <div style={{ marginTop: '14px' }}>
                        <div className="metric-row">
                            <span className="metric-label dot yellow">Idea Submissions</span>
                            <span className="metric-value yellow" style={{ fontSize: '18px' }}>27</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-label dot orange">Challenge Submissions</span>
                            <span className="metric-value orange" style={{ fontSize: '18px' }}>8</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ─── SUCCESS STORIES STRIP ───────────── */}
            <section className="success-strip">
                <div className="strip-header">
                    <h2><span className="icon">🏆</span> Success Stories Showcase</h2>
                </div>
                <div className="stories-grid">
                    <div className="story-card">
                        <div className="story-num">Story 1</div>
                        <h4>Unified Customer 360 Platform</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>Fragmented customer data across 5 systems; agents spent 8 min/call looking up history.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>Built a real-time data fabric unifying CRM, billing, support, and IoT telemetry into a single view.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>60% ↓</strong> avg. handle time · <strong>+22 NPS</strong> · <strong>$4.2M</strong> annual savings</p>
                        </div>
                    </div>
                    <div className="story-card">
                        <div className="story-num">Story 2</div>
                        <h4>Smart Warehouse Routing</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>Manual forklift routing led to 35% idle travel time and frequent aisle congestion.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>IoT sensors + reinforcement learning for dynamic path optimization in real-time.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>40% ↓</strong> pick-time · <strong>28% ↑</strong> throughput · <strong>Zero</strong> aisle collisions</p>
                        </div>
                    </div>
                    <div className="story-card">
                        <div className="story-num">Story 3</div>
                        <h4>Predictive Maintenance Engine</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>Unexpected equipment failures causing 120+ hrs/year of unplanned downtime per plant.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>Streaming anomaly detection on 10K+ sensor signals, predicting failures 72 hrs ahead.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>85% ↓</strong> unplanned downtime · <strong>$7.1M</strong> saved · <strong>3.8×</strong> ROI in Year 1</p>
                        </div>
                    </div>
                    <div className="story-card">
                        <div className="story-num">Story 4</div>
                        <h4>AI-Powered Demand Forecasting</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>Static forecasting models caused 18% overstock and 12% stockouts across 200+ SKUs.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>Ensemble ML model combining weather, social signals, and POS data for real-time demand prediction.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>92%</strong> forecast accuracy · <strong>$3.8M</strong> inventory savings · <strong>8% ↑</strong> fill rate</p>
                        </div>
                    </div>
                    <div className="story-card">
                        <div className="story-num">Story 5</div>
                        <h4>Intelligent Document Processing</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>Legal team manually reviewed 5,000+ contracts/quarter, averaging 45 min per document.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>LLM-powered extraction pipeline identifying clauses, obligations, and risk flags automatically.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>70% ↓</strong> review time · <strong>99.2%</strong> clause detection · <strong>$2.1M</strong> annual savings</p>
                        </div>
                    </div>
                    <div className="story-card">
                        <div className="story-num">Story 6</div>
                        <h4>Carbon Footprint Optimizer</h4>
                        <div className="story-section">
                            <div className="label problem">⚠ Problem</div>
                            <p>No visibility into Scope 3 emissions across 400+ suppliers, risking ESG compliance.</p>
                        </div>
                        <div className="story-section">
                            <div className="label solution">💡 Solution</div>
                            <p>Supply chain carbon tracking platform with automated reporting and reduction recommendations.</p>
                        </div>
                        <div className="story-section">
                            <div className="label impact">📈 Impact</div>
                            <p><strong>32% ↓</strong> carbon footprint · <strong>100%</strong> ESG compliance · <strong>Top 5%</strong> industry benchmark</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TEAM SECTION ────────────────────── */}
            <section className="team-section">
                <div className="team-header">
                    <h2><span className="icon">👥</span> Meet the Innovation Team</h2>
                </div>
                <div className="team-grid">
                    {/* hardcoded team members for now to match exactly */}
                    <TeamMember avatar="SB" name="Siddharth Banerjee" role="Innovation Lead" bio="Driving enterprise-scale digital transformation with 15+ years in AI & cloud architecture." stats={{ ideas: 6, scaled: 3, roi: "3.2x" }} color="green" />
                    <TeamMember avatar="AB" name="Ananya Basu" role="AI / ML Engineer" bio="GenAI specialist building conversational AI and intelligent automation solutions." stats={{ ideas: 5, piloting: 2, kudos: 189 }} color="blue" />
                    <TeamMember avatar="RP" name="Rohan Patel" role="IoT & Digital Twin Lead" bio="Building real-time simulation platforms for manufacturing and logistics optimization." stats={{ ideas: 4, piloting: 2, costCut: "70%" }} color="teal" />
                    <TeamMember avatar="MS" name="Meera Singh" role="Data Science Lead" bio="Expert in NLP, document intelligence, and building data-driven decision systems." stats={{ ideas: 3, piloting: 1, accuracy: "95%" }} color="purple" />
                    <TeamMember avatar="DG" name="Debarati Ghosh" role="Full-Stack Developer" bio="Cloud-native architect crafting scalable microservices and real-time data pipelines." stats={{ ideas: 4, prototyped: 2, prs: 42 }} color="orange" />
                    <TeamMember avatar="AK" name="Arjun Kumar" role="UX / Design Lead" bio="Human-centered design advocate creating intuitive experiences for enterprise tools." stats={{ ideas: 3, scaled: 1, nps: "+22" }} color="pink" />
                    <TeamMember avatar="PD" name="Priya Dasgupta" role="Product Manager" bio="Bridging business strategy with tech execution. 12+ years in enterprise product management." stats={{ ideas: 7, shipped: 4, revenue: "$5M" }} color="green" />
                    <TeamMember avatar="VR" name="Vikram Rao" role="Cloud Architect" bio="Designing resilient multi-cloud infrastructure for mission-critical innovation workloads." stats={{ ideas: 3, deployed: 3, uptime: "99.9%" }} color="blue" />
                    <TeamMember avatar="NK" name="Neha Kapoor" role="Data Engineer" bio="Building scalable data lakehouse architectures and real-time streaming pipelines." stats={{ ideas: 5, prototyped: 3, throughput: "10x" }} color="teal" />
                    <TeamMember avatar="SC" name="Sourav Chatterjee" role="DevOps Lead" bio="CI/CD evangelist automating deployment pipelines and infrastructure-as-code at scale." stats={{ ideas: 4, automated: 8, deploys: "200+" }} color="orange" />
                </div>

                {!isAuthenticated && (
                    <div className="team-join-banner">
                        <div className="join-text">
                            <h3>Join the Movement</h3>
                            <p>Whether you're a developer, designer, data scientist, or domain expert — the Innovation Pipeline is open for everyone. Register today and start turning your ideas into impact.</p>
                        </div>
                        <Link to="/register" className="join-btn">✨ Register & Join</Link>
                    </div>
                )}
            </section>

            {/* ─── NEWSLETTER SECTION ═══════════════════ */}
            <section className="newsletter-section">
                <div className="newsletter-icon">📧</div>
                <h2>Stay Updated with Innovation Insights</h2>
                <p>Subscribe to our newsletter and get the latest challenges, success stories, and innovation tips delivered straight to your inbox every week.</p>

                <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
                    <input
                        type="email"
                        className="newsletter-input"
                        placeholder="Enter your email address"
                        required
                    />
                    <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
            </section>
        </div>
    );
};


