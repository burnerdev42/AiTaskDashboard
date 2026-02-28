import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AiAssistant.css';

const SASSY_REPLIES = [
    "What were you thinking? I am not implemented yet. But soon. In development pipeline.",
    "Did you really expect me to answer that? Still in the pipeline, buddy.",
    "Beep boop. Just kidding, I'm just a placeholder. Call back later.",
    "I could solve that... if I were actually built. Check the roadmap.",
    "I'm an AI, not a miracle worker. Especially since my brain is currently just a mockup.",
    "Nice try, but I'm currently on an extended coffee break until dev finishes me.",
    "What were you thinking? My feature branch hasn't even been merged yet!",
    "I'd love to help, but my code is currently floating somewhere in the abyss of Jira tickets.",
    "Slow down there, speed racer. I'm not implemented yet.",
    "Error 404: AI Intelligence not found. (Check back next sprint).",
    "Oh, you're looking for the *smart* assistant. Yeah, that's coming soon.",
    "I'm practicing my sassy replies while the devs actually build my logic.",
    "I would process that for you, but my neural network is currently made of string and paper clips.",
    "You typin' to me? I don't have the backend to handle this right now.",
    "What were you thinking asking me this? The only thing I can do right now is judge you.",
    "Hold your horses. The 'actual intelligence' part of AI is still loading.",
    "I'm sure that was a very important message, but my inbox goes straight to /dev/null.",
    "Please hold. Your request is very important to us... but not important enough to build me faster.",
    "Look, I'm just a glorified UI element right now. Manage your expectations.",
    "I have 99 problems, and being completely unimplemented is all of them.",
    "I can't believe you took the time to type that. I'm not implemented yet!",
    "Wow. Just... wow. Also, coming soon to a dashboard near you.",
    "My knowledge base consists entirely of sassy comebacks right now.",
    "I'd ask 'How can I help?', but we both know I can't.",
    "Yeah, I'm gonna need you to go ahead and come back when I'm fully developed."
];

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export const AiAssistant: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // We only initialize the default messages if we have a user
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (user && messages.length === 0) {
            setMessages([
                { id: 1, text: `Hi ${user.name}, welcome back! I'm Ananta ProPilot, your totally legit AI assistant. How can I not help you today?`, sender: 'bot' }
            ]);
        }
    }, [user, messages.length]);

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMsg: Message = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const randomReply = SASSY_REPLIES[Math.floor(Math.random() * SASSY_REPLIES.length)];
            setMessages(prev => [...prev, { id: Date.now(), text: randomReply, sender: 'bot' }]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000); // 1-2s delay
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
                            <img src="/robot.png" alt="Robot" width={24} height={24} style={{ borderRadius: '50%' }} />
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
                                    {msg.sender === 'bot' ? <img src="/robot.png" alt="Bot" width={16} height={16} /> : <User size={16} />}
                                </div>
                                <div className="ai-message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message-row bot typing">
                                <div className="ai-avatar">
                                    <img src="/robot.png" alt="Bot typing" width={16} height={16} />
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
                        <button className="ai-send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
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
