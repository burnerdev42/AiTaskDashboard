import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from '../components/ui/ChallengeCard';
import { storage } from '../services/storage';
import { type Challenge } from '../types';

import { TeamMember } from '../components/ui/TeamMember';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribeSuccess, setSubscribeSuccess] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isPaused = useRef(false);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail || isSubscribing) return;
        setIsSubscribing(true);
        setTimeout(() => {
            setIsSubscribing(false);
            setSubscribeSuccess(true);
            setNewsletterEmail('');
            setTimeout(() => setSubscribeSuccess(false), 4000);
        }, 1000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setChallenges(storage.getChallenges());
            setIsLoading(false);
        }, 800); // Small delay for smooth entry
        return () => clearTimeout(timer);
    }, []);

    const nextSlide = () => {
        if (challenges.length === 0 || isLoading) return;
        setCurrentSlide((prev) => (prev + 1) % challenges.length);
    };

    const prevSlide = () => {
        if (challenges.length === 0 || isLoading) return;
        setCurrentSlide((prev) => (prev - 1 + challenges.length) % challenges.length);
    };

    // Continuous auto-play every 5 seconds, pause on hover
    useEffect(() => {
        if (challenges.length <= 1 || isLoading) return;
        const timer = setInterval(() => {
            if (!isPaused.current) {
                setCurrentSlide((prev) => (prev + 1) % challenges.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [challenges.length, isLoading]);

    return (
        <div className="home-dashboard-layout">
            {/* ─── HIGHLIGHTED CHALLENGES CAROUSEL ──── */}
            <section
                className={`carousel-section ${isLoading ? 'loading' : 'fade-in'}`}
                onMouseEnter={() => { isPaused.current = true; }}
                onMouseLeave={() => { isPaused.current = false; }}
            >
                <div className="carousel-header">
                    <h2><span className="icon" style={{ color: 'var(--accent-gold)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Top Rated Challenges</h2>
                    <div className="carousel-controls">
                        <button className="carousel-btn" onClick={prevSlide} aria-label="Previous" disabled={isLoading}>&#8249;</button>
                        <span className="carousel-indicator">{isLoading ? '-- / --' : `${currentSlide + 1} / ${challenges.length}`}</span>
                        <button className="carousel-btn" onClick={nextSlide} aria-label="Next" disabled={isLoading}>&#8250;</button>
                    </div>
                </div>

                <div className="carousel-viewport">
                    {isLoading ? (
                        <div className="carousel-track">
                            <div className="carousel-slide">
                                <div className="challenge-card skeleton" style={{ height: '320px', cursor: 'default' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100%' }}>
                                        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '32px', width: '80%' }}></div>
                                        <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                                            <div className="skeleton" style={{ width: '120px', height: '16px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {challenges.map((challenge) => (
                                <div className="carousel-slide" key={challenge.id}>
                                    <ChallengeCard challenge={challenge} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="carousel-dots">
                    {isLoading ? (
                        <div className="carousel-dot active skeleton" style={{ width: '40px' }}></div>
                    ) : (
                        challenges.map((_, idx) => (
                            <button
                                key={idx}
                                className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(idx)}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* ─── METRICS DASHBOARD ───────────────── */}
            <aside className={`metrics-dashboard ${!isLoading ? 'fade-in' : ''}`}>
                {/* Metric Panels */}
                <div className="metric-panel">
                    <h3><span className="icon" style={{ marginRight: '8px', color: 'var(--accent-teal)', verticalAlign: 'middle' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg></span> Pipeline Summary</h3>
                    {isLoading ? (
                        <>
                            <div className="donut-skeleton skeleton"></div>
                            <div className="legend">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '8px', borderRadius: '4px' }}></div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="donut-chart">
                                    <div className="donut-hole">11</div>
                                </div>
                            </div>
                            <div className="legend">
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-red)', flexShrink: 0 }}></span> Challenge Submitted (4)</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-yellow)', flexShrink: 0 }}></span> Ideation &amp; Evaluation (2)</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-blue)', flexShrink: 0 }}></span> POC &amp; Pilot (3)</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-gold)', flexShrink: 0 }}></span> Scaled &amp; Deployed (1)</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-grey)', flexShrink: 0 }}></span> Parking Lot (1)</div>
                            </div>
                        </>
                    )}
                </div>

                <div className="metric-panel">
                    <h3><span className="icon" style={{ marginRight: '8px', color: 'var(--accent-blue)', verticalAlign: 'middle' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span> Key Metrics</h3>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                            {[...Array(2)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ height: '20px', width: '40px', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="metric-row">
                                <span className="metric-label">Avg. Idea → Pilot</span>
                                <span className="metric-value teal">42d</span>
                            </div>
                            <div className="metric-row">
                                <span className="metric-label">Pilot Success Rate</span>
                                <span className="metric-value green">78%</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Panel 3 simplified for React without specific charting lib availability yet, matching HTML structure */}
                <div className="metric-panel">
                    <h3><span className="icon" style={{ marginRight: '8px', color: 'var(--accent-yellow)', verticalAlign: 'middle' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></span> Monthly Throughput</h3>
                    {isLoading ? (
                        <>
                            <div className="spark-bars-skeleton">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="spark-bar-skeleton skeleton" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: '4px' }}></div>
                            </div>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </aside>

            {/* ─── SUCCESS STORIES STRIP ───────────── */}
            <section className={`success-strip ${!isLoading ? 'fade-in' : ''}`}>
                <div className="strip-header">
                    <h2><span className="icon" style={{ color: 'var(--accent-gold)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg></span> Success Stories Showcase</h2>
                </div>
                <div className="stories-grid">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="story-card-skeleton">
                                <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '24px', width: '80%', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ flex: 1, borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '20px', width: '100%', borderRadius: '10px' }}></div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="story-card">
                                <div className="story-num">Story 1</div>
                                <h4>Unified Customer 360 Platform</h4>
                                <div className="story-section">
                                    <div className="label problem"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span> Problem</div>
                                    <p>Fragmented customer data across 5 systems; agents spent 8 min/call looking up history.</p>
                                </div>
                                <div className="story-section">
                                    <div className="label solution"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"></path></svg></span> Solution</div>
                                    <p>Built a real-time data fabric unifying CRM, billing, support, and IoT telemetry into a single view.</p>
                                </div>
                                <div className="story-section">
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>1.2K</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>89</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>34</strong> Comments</span>
                                    </div>
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
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>987</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>72</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>28</strong> Comments</span>
                                    </div>
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
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>1.5K</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>104</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>41</strong> Comments</span>
                                    </div>
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
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>856</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>63</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>19</strong> Comments</span>
                                    </div>
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
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>1.1K</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>91</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>37</strong> Comments</span>
                                    </div>
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
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>743</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>58</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>22</strong> Comments</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ─── TEAM SECTION ────────────────────── */}
            <section className={`team-section ${!isLoading ? 'fade-in' : ''}`}>
                <div className="team-header">
                    <h2><span className="icon" style={{ color: 'var(--accent-teal)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> Meet the Innovation Team</h2>
                </div>
                <div className="team-grid">
                    {isLoading ? (
                        [...Array(10)].map((_, i) => (
                            <div key={i} className="team-member-skeleton">
                                <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%' }}></div>
                                <div className="skeleton" style={{ width: '120px', height: '18px', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }}></div>
                            </div>
                        ))
                    ) : (
                        <>
                            {/* Render the logged-in user dynamically if present */}
                            {isAuthenticated && user && (
                                <TeamMember
                                    avatar={user.avatar && user.avatar.length > 2 ? user.avatar : (user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'ME')}
                                    name={user.name || 'Current User'}
                                    role={user.role || ''}
                                    bio={user.about || ''}
                                    stats={{ challenges: 0, ideas: 0, score: 0 }}
                                    color="gold"
                                />
                            )}
                            <TeamMember avatar="SB" name="Siddharth Banerjee" role="Innovation Lead" bio="Driving enterprise-scale digital transformation with 15+ years in AI & cloud architecture." stats={{ challenges: 4, ideas: 6, score: 92 }} color="green" />
                            <TeamMember avatar="AB" name="Ananya Basu" role="AI / ML Engineer" bio="GenAI specialist building conversational AI and intelligent automation solutions." stats={{ challenges: 3, ideas: 5, score: 87 }} color="blue" />
                            <TeamMember avatar="RP" name="Rohan Patel" role="IoT & Digital Twin Lead" bio="Building real-time simulation platforms for manufacturing and logistics optimization." stats={{ challenges: 2, ideas: 4, score: 81 }} color="teal" />
                            <TeamMember avatar="MS" name="Meera Singh" role="Data Science Lead" bio="Expert in NLP, document intelligence, and building data-driven decision systems." stats={{ challenges: 2, ideas: 3, score: 78 }} color="purple" />
                            <TeamMember avatar="DG" name="Debarati Ghosh" role="Full-Stack Developer" bio="Cloud-native architect crafting scalable microservices and real-time data pipelines." stats={{ challenges: 3, ideas: 4, score: 84 }} color="orange" />
                            <TeamMember avatar="AK" name="Arjun Kumar" role="UX / Design Lead" bio="Human-centered design advocate creating intuitive experiences for enterprise tools." stats={{ challenges: 1, ideas: 3, score: 76 }} color="pink" />
                            <TeamMember avatar="PD" name="Priya Dasgupta" role="Product Manager" bio="Bridging business strategy with tech execution. 12+ years in enterprise product management." stats={{ challenges: 5, ideas: 7, score: 95 }} color="green" />
                            <TeamMember avatar="VR" name="Vikram Rao" role="Cloud Architect" bio="Designing resilient multi-cloud infrastructure for mission-critical innovation workloads." stats={{ challenges: 3, ideas: 3, score: 82 }} color="blue" />
                            <TeamMember avatar="NK" name="Neha Kapoor" role="Data Engineer" bio="Building scalable data lakehouse architectures and real-time streaming pipelines." stats={{ challenges: 2, ideas: 5, score: 88 }} color="teal" />
                            <TeamMember avatar="SC" name="Sourav Chatterjee" role="DevOps Lead" bio="CI/CD evangelist automating deployment pipelines and infrastructure-as-code at scale." stats={{ challenges: 3, ideas: 4, score: 85 }} color="orange" />
                        </>
                    )}
                </div>

                {!isAuthenticated && (
                    <div className="team-join-banner">
                        <div className="join-text">
                            <h3>Join the Movement</h3>
                            <p>Whether you're a developer, designer, data scientist, or domain expert — the Innovation Pipeline is open for everyone. Register today and start turning your ideas into impact.</p>
                        </div>
                        <Link to="/register" className="join-btn">
                            <span className="icon" style={{ marginRight: '8px', display: 'inline-flex' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg></span> Register & Join
                        </Link>
                    </div>
                )}
            </section>

            {/* ─── NEWSLETTER SECTION ═══════════════════ */}
            <section className="newsletter-section">
                <div className="newsletter-icon">
                    <div style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Outer diffuse glow ring */}
                        <div style={{
                            position: 'absolute',
                            width: '110px',
                            height: '110px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(232, 167, 88, 0.12) 0%, transparent 70%)',
                            animation: 'pulse-ring 3s ease-in-out infinite',
                        }} />
                        {/* Main icon container */}
                        <div style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '76px',
                            height: '76px',
                            borderRadius: '20px',
                            background: 'linear-gradient(145deg, rgba(232, 167, 88, 0.18) 0%, rgba(255, 213, 79, 0.08) 100%)',
                            border: '1px solid rgba(232, 167, 88, 0.35)',
                            boxShadow: '0 4px 24px rgba(232, 167, 88, 0.2), 0 0 0 1px rgba(232, 167, 88, 0.08) inset',
                        }}>
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="mailGradMain" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#e8a758" />
                                        <stop offset="100%" stopColor="#ffd54f" />
                                    </linearGradient>
                                </defs>
                                <rect width="20" height="16" x="2" y="4" rx="2.5" stroke="url(#mailGradMain)" strokeWidth="1.5" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="url(#mailGradMain)" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h2>Stay Updated with Innovation Insights</h2>
                <p>Subscribe to our newsletter and get the latest challenges, success stories, and innovation tips delivered straight to your inbox every week.</p>

                <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        className="newsletter-input"
                        placeholder="Enter your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        disabled={isSubscribing}
                    />
                    <button
                        type="submit"
                        className="newsletter-btn"
                        disabled={!isValidEmail || isSubscribing}
                        style={{
                            opacity: (isValidEmail && !isSubscribing) ? 1 : 0.45,
                            cursor: (isValidEmail && !isSubscribing) ? 'pointer' : 'not-allowed',
                            transition: 'opacity 0.25s ease',
                        }}
                    >{isSubscribing ? 'Subscribing...' : 'Subscribe'}</button>
                </form>
            </section>

            {/* Toast Notification */}
            <div className={`subscribe-toast ${subscribeSuccess ? 'show' : ''}`}>
                <span className="toast-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </span>
                <div className="toast-content">
                    <strong>Successfully Subscribed!</strong>
                    <span>You'll receive innovation insights in your inbox weekly.</span>
                </div>
                <button className="toast-close" onClick={() => setSubscribeSuccess(false)}>&times;</button>
            </div>
        </div>
    );
};


