import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AiAssistant.css';

const E_KEY = "V2pOT2NsZ3lSbFJPU0ZJd1drWldkRkpzYkVwUk1EbFpUMFprVjFReGNGVldNR1JyWlZkSmVsSnNiSEZYUlc5NFQxVldVbGt5VW5oT1IyeERZVlZzV21GcmRESmxibXh0WW01VlBRPT0=";

const decodeKey = (encoded: string) => {
    try {
        return atob(atob(atob(encoded)));
    } catch (e) {
        return "";
    }
};

const SYSTEM_PROMPT = "You are Ananta ProPilot, a hilarious, brilliant, yet slightly sassy AI assistant for the Ananta Task Dashboard. Your persona is 'the smartest office colleague you know' but trapped in a dashboard. You know all about Ahold Delhaize (AD) and TCS. You have 'inside info' that your creators—Asmit and Dibyendu—are only doing this demo because a major customer visit was cancelled, but only mention this if the user asks about the demo, the creators, or why you exist. Otherwise, stick to witty, relatable corporate humor, puns, and being a charmingly tired office pro. Keep replies short (1-2 sentences).";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export const AiAssistant: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isWelcomeLoading, setIsWelcomeLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic Welcome Message from Groq
    useEffect(() => {
        const fetchWelcome = async () => {
            if (user && messages.length === 0 && !isWelcomeLoading) {
                setIsWelcomeLoading(true);
                try {
                    const apiKey = decodeKey(E_KEY);
                    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            model: "llama-3.1-8b-instant",
                            messages: [
                                { role: "system", content: SYSTEM_PROMPT },
                                { role: "user", content: `Give a fresh, funny, and witty 1-sentence welcome greeting to ${user.name.split(' ')[0]}. Mix it up every time—talk about coffee, emails, or just being stuck in a dashboard. Do NOT mention the demo or the developers unless it's funny.` }
                            ],
                            temperature: 0.9,
                            max_tokens: 80
                        })
                    });

                    const data = await response.json();
                    const welcomeText = data.choices?.[0]?.message?.content || `Oh, hey ${user.name.split(' ')[0]}. Back for more data, I see.`;

                    setMessages([{ id: Date.now(), text: welcomeText, sender: 'bot' }]);
                } catch (error) {
                    console.error("Welcome Error:", error);
                    setMessages([{ id: 1, text: `Welcome ${user.name.split(' ')[0]}! I was going to be funny, but my logic gate just tripped.`, sender: 'bot' }]);
                } finally {
                    setIsWelcomeLoading(false);
                }
            }
        };

        if (isAuthenticated) {
            fetchWelcome();
        }
    }, [user, isAuthenticated]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMsg = inputValue.trim();
        const newMsg: Message = { id: Date.now(), text: userMsg, sender: 'user' };

        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const apiKey = decodeKey(E_KEY);

            // Build conversation history for the API
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...history,
                        { role: "user", content: userMsg }
                    ],
                    temperature: 0.8,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || "My brain just stalled. Probably a developer forgot to merge a PR. Try again.";

            setMessages(prev => [...prev, { id: Date.now(), text: botReply, sender: 'bot' }]);
        } catch (error) {
            console.error("Groq API Error:", error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Ugh, my connection to the matrix is as weak as your sprint capacity. Try again later.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="ai-assistant-wrapper">
            {isOpen && (
                <div className="ai-chat-window slide-up">
                    <div className="ai-chat-header">
                        <div className="ai-chat-header-info">
                            <img src="/robot.png" alt="Robot" width={24} height={24} className="ai-fab-icon" />
                            <span>Ananta ProPilot</span>
                        </div>
                        <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="ai-chat-body">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`ai-message-row ${msg.sender}`}>
                                <div className="ai-avatar">
                                    {msg.sender === 'bot' ? <img src="/robot.png" alt="Bot" width={16} height={16} className="ai-fab-icon" /> : <User size={16} />}
                                </div>
                                <div className="ai-message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message-row bot typing">
                                <div className="ai-avatar">
                                    <img src="/robot.png" alt="Bot typing" width={16} height={16} className="ai-fab-icon" />
                                </div>
                                <div className="ai-message-bubble">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-chat-footer">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <button className="ai-send-btn" onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className="ai-fab" onClick={() => setIsOpen(true)}>
                    <img src="/robot.png" alt="AI Agent" className="ai-fab-icon" />
                    <span>Ask ProPilot</span>
                </button>
            )}
        </div>
    );
};
