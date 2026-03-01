import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from '../components/ui/ChallengeCard';
import { storage } from '../services/storage';
import { type Challenge } from '../types';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import { TeamMember } from '../components/ui/TeamMember';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [pipelineData, setPipelineData] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState<any[]>([]);
    const [throughputData, setThroughputData] = useState<any[]>([]);
    const [successStories, setSuccessStories] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribeSuccess, setSubscribeSuccess] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isPaused = useRef(false);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail);

    const calculateMetrics = () => {
        const allChallenges = storage.getChallenges();
        const allIdeaDetails = storage.getIdeaDetails();

        // Pipeline Stage Calculation
        const stageCounts = {
            'Challenge Submitted': { c: 0, i: 0 },
            'Ideation & Evaluation': { c: 0, i: 0 },
            'POC & Pilot': { c: 0, i: 0 },
            'Scaled & Deployed': { c: 0, i: 0 },
            'Parking Lot': { c: 0, i: 0 },
        };

        allChallenges.forEach(c => {
            const s = c.stage as keyof typeof stageCounts;
            if (stageCounts[s]) stageCounts[s].c++;
        });

        allIdeaDetails.forEach(idea => {
            // Find which challenge this idea belongs to
            const chIndex = storage.getChallengeDetails().findIndex(cd =>
                cd.ideas && cd.ideas.some((i: any) => i.id === idea.id)
            );
            if (chIndex !== -1) {
                const chalId = storage.getChallengeDetails()[chIndex].id;
                const parentCh = allChallenges.find(c => c.id === chalId);
                if (parentCh) {
                    const s = parentCh.stage as keyof typeof stageCounts;
                    if (stageCounts[s]) stageCounts[s].i++;
                }
            }
        });

        setPipelineData([
            { name: 'Challenge Submitted', challenges: stageCounts['Challenge Submitted'].c, ideas: stageCounts['Challenge Submitted'].i, color: 'var(--accent-red)' },
            { name: 'Ideation & Evaluation', challenges: stageCounts['Ideation & Evaluation'].c, ideas: stageCounts['Ideation & Evaluation'].i, color: 'var(--accent-yellow)' },
            { name: 'POC & Pilot', challenges: stageCounts['POC & Pilot'].c, ideas: stageCounts['POC & Pilot'].i, color: 'var(--accent-blue)' },
            { name: 'Scaled & Deployed', challenges: stageCounts['Scaled & Deployed'].c, ideas: stageCounts['Scaled & Deployed'].i, color: 'var(--accent-green)' },
            { name: 'Parking Lot', challenges: stageCounts['Parking Lot'].c, ideas: stageCounts['Parking Lot'].i, color: 'var(--accent-grey)' }
        ]);

        // Home KPIs Calculation  
        const users = storage.getUsers();
        const totalC = allChallenges.length;
        const totalI = allIdeaDetails.length;
        const convRate = totalI > 0 ? ((stageCounts['POC & Pilot'].i + stageCounts['Scaled & Deployed'].i) / totalI * 100).toFixed(1) + '%' : '0%';

        // Get unique active contributors from ideas and challenges
        const activeContributors = new Set();
        allIdeaDetails.forEach(i => activeContributors.add(i.owner.name));
        allChallenges.forEach(c => activeContributors.add(c.owner.name));

        // Dynamically get all users and compute their idea/challenge counts
        const allUsers = storage.getUsers().filter((u: any) => u.role === 'ADMIN' || u.role?.toUpperCase() === 'MEMBER').map((u: any) => {
            let userChall = 0;
            let userIdeas = 0;
            allChallenges.forEach(c => { if (c.owner.name === u.name) userChall++; });
            allIdeaDetails.forEach(i => { if (i.owner.name === u.name) userIdeas++; });

            return {
                ...u,
                stats: { challenges: userChall, ideas: userIdeas, score: (userChall * 5 + userIdeas * 2) }
            };
        }).sort((a: any, b: any) => b.stats.score - a.stats.score);

        setTeamMembers(allUsers.slice(0, 10)); // Top 10 contributors

        setKpiData([
            { label: 'Total Challenges', value: totalC.toString(), color: 'var(--accent-red)' },
            { label: 'Ideas Generated', value: totalI.toString(), color: 'var(--accent-yellow)' },
            { label: 'Conversion Rate', value: convRate, color: 'var(--accent-teal)' },
            { label: 'Avg. Time to Pilot', value: '14d', color: 'var(--accent-blue)' },
            { label: 'Total Users', value: users.length.toString(), color: 'var(--accent-purple)' },
            { label: 'Active Contributors', value: activeContributors.size.toString(), color: 'var(--accent-green)' },
        ]);

        // Mock throughput (In a real app, this would group by actual createdDate arrays)
        setThroughputData([
            { name: 'Sep', ideas: Math.floor(totalI * 0.1), challenges: Math.floor(totalC * 0.1) },
            { name: 'Oct', ideas: Math.floor(totalI * 0.15), challenges: Math.floor(totalC * 0.15) },
            { name: 'Nov', ideas: Math.floor(totalI * 0.15), challenges: Math.floor(totalC * 0.15) },
            { name: 'Dec', ideas: Math.floor(totalI * 0.1), challenges: Math.floor(totalC * 0.1) },
            { name: 'Jan', ideas: Math.floor(totalI * 0.2), challenges: Math.floor(totalC * 0.2) },
            { name: 'Feb', ideas: Math.floor(totalI * 0.3), challenges: Math.floor(totalC * 0.3) }
        ]);
    };

    const renderActiveShape = (props: any) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        const offset = 12; // Increased pop-out distance
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const ox = cx + offset * cos;
        const oy = cy + offset * sin;

        return (
            <Sector
                cx={ox}
                cy={oy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 4}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={10}
                style={{
                    filter: `drop-shadow(0px 12px 18px ${fill}bf)`,
                    transition: 'all 0.2s ease-out'
                }}
            />
        );
    };

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
        if (!isAuthenticated) return;
        setIsLoading(true);
        const timer = setTimeout(() => {
            const allChall = storage.getChallenges();

            // Sort by a combined popularity score: views + (votes * 10) + (comments * 5)
            const sortedChallenges = [...allChall].sort((a, b) => {
                const scoreA = Number(a.stats?.views || 0) + (Number(a.stats?.votes || 0) * 10) + (Number(a.stats?.comments || 0) * 5);
                const scoreB = Number(b.stats?.views || 0) + (Number(b.stats?.votes || 0) * 10) + (Number(b.stats?.comments || 0) * 5);
                return scoreB - scoreA;
            });

            setChallenges(sortedChallenges.slice(0, 5));

            // Fetch Success Stories - filter for Scaled & Deployed
            const allDetails = storage.getChallengeDetails();
            let completedChallenges = allDetails.filter(d => d.stage === 'Scaled & Deployed');

            // If we don't have enough Scaled & Deployed, include POC & Pilot
            if (completedChallenges.length < 3) {
                const pilots = allDetails.filter(d => d.stage === 'POC & Pilot');
                completedChallenges = [...completedChallenges, ...pilots].slice(0, 6);
            } else {
                completedChallenges = completedChallenges.slice(0, 6);
            }

            const stories = completedChallenges.map((ch, index) => {
                const totalViews = ch.ideas?.reduce((sum, idea) => sum + (idea.views || 0), 0) || (index + 1) * 150 + 450;
                return {
                    id: ch.id,
                    num: `Story ${index + 1}`,
                    title: ch.title,
                    problem: ch.problemStatement.length > 120 ? ch.problemStatement.substring(0, 117) + '...' : ch.problemStatement,
                    solution: ch.expectedOutcome.length > 120 ? ch.expectedOutcome.substring(0, 117) + '...' : ch.expectedOutcome,
                    stats: {
                        views: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(),
                        appreciations: ch.stats.appreciations || 0,
                        comments: ch.stats.comments || 0
                    }
                };
            });
            setSuccessStories(stories);

            calculateMetrics();
            setIsLoading(false);
        }, 800); // Small delay for smooth entry
        return () => clearTimeout(timer);
    }, [isAuthenticated, user]);

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
                        <div style={{ width: '100%', height: '320px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pipelineData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={110}
                                        outerRadius={130}
                                        paddingAngle={6}
                                        cornerRadius={8}
                                        stroke="none"
                                        dataKey="challenges"
                                        activeShape={renderActiveShape}
                                    >
                                        {pipelineData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                style={{
                                                    filter: `drop-shadow(0px 4px 6px ${entry.color}30)`,
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        cursor={false}
                                        isAnimationActive={false}
                                        wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '13px', minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                                                        <div style={{ fontWeight: '600', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid var(--border)', color: data.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: data.color }}></div>
                                                            {data.name}
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Challenges:</span> <strong style={{ fontSize: '14px' }}>{data.challenges}</strong></div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Ideas:</span> <strong style={{ fontSize: '14px' }}>{data.ideas}</strong></div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Centered Total Label overlay */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                <div style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1', color: 'var(--text-primary)' }}>{storage.getChallenges().length}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>Challenges</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="metric-panel">
                    <h3><span className="icon" style={{ marginRight: '8px', color: 'var(--accent-blue)', verticalAlign: 'middle' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span> Key Metrics</h3>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ height: '20px', width: '40px', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                            {kpiData.map((kpi) => (
                                <div key={kpi.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>{kpi.label}</span>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: kpi.color }}>{kpi.value}</span>
                                </div>
                            ))}
                        </div>
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
                        </>
                    ) : (
                        <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={throughputData}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    barGap={2}
                                    barCategoryGap="25%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }}
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-secondary)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ padding: '2px 0' }}
                                    />
                                    <Bar
                                        dataKey="ideas"
                                        fill="var(--accent-yellow)"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                    <Bar
                                        dataKey="challenges"
                                        fill="var(--accent-orange)"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {!isLoading && (
                        <div style={{ marginTop: '20px' }}>
                            <div className="metric-row">
                                <span className="metric-label dot yellow">Idea Submissions</span>
                                <span className="metric-value yellow" style={{ fontSize: '18px' }}>{storage.getIdeaDetails().length}</span>
                            </div>
                            <div className="metric-row">
                                <span className="metric-label dot orange">Challenge Submissions</span>
                                <span className="metric-value orange" style={{ fontSize: '18px' }}>{storage.getChallenges().length}</span>
                            </div>
                        </div>
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
                            {successStories.length > 0 ? (
                                successStories.map((story) => (
                                    <div className="story-card" key={story.id}>
                                        <div className="story-num">{story.num}</div>
                                        <Link to={`/challenges/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h4>{story.title}</h4>
                                        </Link>
                                        <div className="story-section">
                                            <div className="label problem"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span> Problem</div>
                                            <p>{story.problem}</p>
                                        </div>
                                        <div className="story-section">
                                            <div className="label solution"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5Z"></path></svg></span> Solution</div>
                                            <p>{story.solution}</p>
                                        </div>
                                        <div className="story-section">
                                            <div className="label engagement"><span className="icon" style={{ marginRight: '6px', display: 'inline-flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span> Engagement</div>
                                            <div className="engagement-stats">
                                                <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> <strong>{story.stats.views}</strong> Views</span>
                                                <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> <strong>{story.stats.appreciations}</strong> Appreciations</span>
                                                <span className="eng-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> <strong>{story.stats.comments}</strong> Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-stories-message" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <p>No success stories to display yet. More innovation impact coming soon!</p>
                                </div>
                            )}
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
                            {teamMembers.map((member: any, idx: number) => {
                                // Skip if it's the current user as that's already rendered first
                                if (isAuthenticated && user && member.email === user.email) return null;

                                return (
                                    <TeamMember
                                        key={member.id}
                                        avatar={member.avatar || member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                        name={member.name}
                                        role={member.role === 'ADMIN' ? 'Innovation Admin' : 'Innovation Member'}
                                        bio={member.about || `Passionate about contributing to ${member.department || 'innovation'} projects.`}
                                        stats={member.stats}
                                        color={idx % 2 === 0 ? "blue" : (idx % 3 === 0 ? "teal" : "orange")}
                                    />
                                );
                            })}
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
            </section >

            {/* Toast Notification */}
            < div className={`subscribe-toast ${subscribeSuccess ? 'show' : ''}`}>
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
            </div >
        </div >
    );
};


