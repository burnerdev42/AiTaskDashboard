import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from '../components/ui/ChallengeCard';
import { storage } from '../services/storage';
import { homeService } from '../services/home.service';
import { mapBackendChallengeToFrontend } from '../services/mappers/challengeMapper';
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
    const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({
        submitted: 0,
        ideation: 0,
        pilot: 0,
        completed: 0,
        archive: 0
    });
    const [keyMetrics, setKeyMetrics] = useState({
        pilotRate: 0,
        conversionRate: 0,
        targetConversionRate: 50
    });
    const [monthlyThroughput, setMonthlyThroughput] = useState<any[]>([]);
    const [successStories, setSuccessStories] = useState<any[]>([]);
    const [innovationTeam, setInnovationTeam] = useState<any[]>([]);
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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch top challenges
            const challengesRes = await homeService.getTopChallenges();
            if (challengesRes.data?.data?.challenges) {
                const mappedChallenges = challengesRes.data.data.challenges.map(mapBackendChallengeToFrontend);
                setChallenges(mappedChallenges);
            }

            // Fetch status distribution
            const statusRes = await homeService.getStatusDistribution();
            if (statusRes.data?.data?.challengesByStatus) {
                setStatusDistribution(statusRes.data.data.challengesByStatus);
            }

            // Fetch key metrics
            const metricsRes = await homeService.getKeyMetrics();
            if (metricsRes.data?.data) {
                setKeyMetrics(metricsRes.data.data);
            }

            // Fetch monthly throughput
            const throughputRes = await homeService.getMonthlyThroughput();
            if (throughputRes.data?.data?.data) {
                setMonthlyThroughput(throughputRes.data.data.data);
            }

            // Fetch success stories (completed challenges)
            const storiesRes = await homeService.getChallengesByStatus('completed');
            if (storiesRes.data?.challenges) {
                const mappedStories = storiesRes.data.challenges.map(mapBackendChallengeToFrontend);
                setSuccessStories(mappedStories);
            }

            // Fetch innovation team
            const teamRes = await homeService.getInnovationTeam();
            if (teamRes.data?.data?.users) {
                setInnovationTeam(teamRes.data.data.users);
            }
        } catch (error) {
            console.error('Failed to fetch home data:', error);
            // Fallback to storage if API fails
            setChallenges(storage.getChallenges().slice(0, 5));
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
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
                                    <div className="donut-hole">{Object.values(statusDistribution).reduce((a, b) => a + b, 0)}</div>
                                </div>
                            </div>
                            <div className="legend">
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-red)', flexShrink: 0 }}></span> Challenge Submitted ({statusDistribution.submitted})</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-yellow)', flexShrink: 0 }}></span> Ideation &amp; Evaluation ({statusDistribution.ideation})</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-blue)', flexShrink: 0 }}></span> POC &amp; Pilot ({statusDistribution.pilot})</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-gold)', flexShrink: 0 }}></span> Scaled &amp; Deployed ({statusDistribution.completed})</div>
                                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-grey)', flexShrink: 0 }}></span> Parking Lot ({statusDistribution.archive})</div>
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
                                <span className="metric-value teal">{keyMetrics.pilotRate}d</span>
                            </div>
                            <div className="metric-row">
                                <span className="metric-label">Pilot Success Rate</span>
                                <span className="metric-value green">{Math.round(keyMetrics.conversionRate)}%</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="metric-panel">
                    <h3><span className="icon" style={{ marginRight: '8px', color: 'var(--accent-yellow)', verticalAlign: 'middle' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></span> Monthly Throughput</h3>
                    {isLoading ? (
                        <>
                            <div className="spark-bars-skeleton">
                                {[30, 70, 45, 80, 50, 65].map((height, i) => (
                                    <div key={i} className="spark-bar-skeleton skeleton" style={{ height: `${height}%` }}></div>
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
                                {monthlyThroughput.map((d, idx) => (
                                    <div key={idx} className="grouped-month">
                                        <div className="spark-bar ideas" style={{ height: `${Math.min(d.ideas * 10, 100)}%`, animationDelay: `${0.5 + idx * 0.08}s` }}></div>
                                        <div className="spark-bar challenges" style={{ height: `${Math.min(d.challenges * 20, 100)}%`, animationDelay: `${0.5 + idx * 0.08 + 0.03}s` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                                {monthlyThroughput.map((d, idx) => {
                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                    return <span key={idx}>{months[d.month - 1]}</span>;
                                })}
                            </div>
                            <div style={{ marginTop: '14px' }}>
                                <div className="metric-row">
                                    <span className="metric-label dot yellow">Idea Submissions</span>
                                    <span className="metric-value yellow" style={{ fontSize: '18px' }}>
                                        {monthlyThroughput.length > 0 ? monthlyThroughput[monthlyThroughput.length - 1].ideas : 0}
                                    </span>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label dot orange">Challenge Submissions</span>
                                    <span className="metric-value orange" style={{ fontSize: '18px' }}>
                                        {monthlyThroughput.length > 0 ? monthlyThroughput[monthlyThroughput.length - 1].challenges : 0}
                                    </span>
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
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="story-card-skeleton">
                                <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '24px', width: '80%', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ flex: 1, borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '20px', width: '100%', borderRadius: '10px' }}></div>
                            </div>
                        ))
                    ) : successStories.length === 0 ? (
                        <div className="no-data-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 40px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>No success stories yet but we are almost there</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Check back soon to see how our top ideas are transforming the business.</p>
                        </div>
                    ) : (
                        successStories.map((story, index) => (
                            <div className="story-card" key={story.id}>
                                <div className="story-num">Story {index + 1}</div>
                                <h4>{story.title}</h4>
                                <div className="story-section">
                                    <div className="label problem"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span> Overview</div>
                                    <p>{story.description.length > 150 ? story.description.substring(0, 150) + '...' : story.description}</p>
                                </div>
                                <div className="story-section">
                                    <div className="label solution"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"></path></svg></span> Impact</div>
                                    <p>Successfully completed and ready for scale-up across the enterprise.</p>
                                </div>
                                <div className="story-section">
                                    <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                    <div className="engagement-stats">
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>{story.views}</strong> Views</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>{story.votes}</strong> Appreciations</span>
                                        <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>{story.comments}</strong> Comments</span>
                                    </div>
                                </div>
                            </div>
                        ))
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
                            {innovationTeam.length === 0 ? (
                                <div className="no-data-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    Innovation team members not yet registered
                                </div>
                            ) : (
                                innovationTeam
                                    .sort((a, b) => (b.innovationScore || 0) - (a.innovationScore || 0))
                                    .map((member, idx) => {
                                        const colors = ['green', 'blue', 'teal', 'purple', 'orange', 'pink', 'gold', 'red'];
                                        const color = colors[idx % colors.length];
                                        const initials = member.name ? member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
                                        const bio = member.interestAreas && member.interestAreas.length > 0
                                            ? `Expert in ${member.interestAreas.join(', ')}.`
                                            : 'Active contributor to the innovation pipeline.';

                                        return (
                                            <TeamMember
                                                key={member._id}
                                                avatar={initials}
                                                name={member.name}
                                                role={member.companyTechRole || 'Innovation Expert'}
                                                bio={bio}
                                                stats={{
                                                    challenges: member.challengeCount || 0,
                                                    ideas: member.totalIdeaCount || 0,
                                                    score: member.innovationScore ? Math.round(member.innovationScore) : Math.floor(Math.random() * 50) + 10
                                                }}
                                                color={color}
                                            />
                                        );
                                    })
                            )}
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
                        <div style={{
                            position: 'absolute',
                            width: '110px',
                            height: '110px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(232, 167, 88, 0.12) 0%, transparent 70%)',
                            animation: 'pulse-ring 3s ease-in-out infinite',
                        }} />
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


