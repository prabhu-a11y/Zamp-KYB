import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUp, X, Sparkles } from 'lucide-react';
import { chatWithKnowledgeBase } from '../services/geminiService';
import knowledgeBaseContent from '../data/knowledgeBase.md?raw';

const KnowledgeBase = () => {
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tableOfContents, setTableOfContents] = useState([]);
    const [showInitialView, setShowInitialView] = useState(true);
    const chatEndRef = useRef(null);
    const contentRef = useRef(null);
    const heroRef = useRef(null);
    const mainContainerRef = useRef(null);

    // Load conversation history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('knowledgeBaseChatHistory');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setMessages(parsed);
                if (parsed.length > 0) {
                    setIsChatMode(true);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }, []);

    // Save conversation history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('knowledgeBaseChatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    // Generate table of contents from markdown
    useEffect(() => {
        const headings = [];
        const lines = knowledgeBaseContent.split('\n');

        lines.forEach((line) => {
            const match = line.match(/^(#{1,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                headings.push({ level, text, id });
            }
        });

        setTableOfContents(headings);
    }, []);

    // Auto scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle scroll to show/hide initial view
    useEffect(() => {
        const handleScroll = () => {
            if (mainContainerRef.current && heroRef.current && !isChatMode) {
                const scrollTop = mainContainerRef.current.scrollTop;
                const heroHeight = heroRef.current.offsetHeight;

                // Show initial view if we're in the top 80% of the hero section
                setShowInitialView(scrollTop < heroHeight * 0.8);
            }
        };

        const containerElement = mainContainerRef.current;
        if (containerElement) {
            containerElement.addEventListener('scroll', handleScroll);
            return () => containerElement.removeEventListener('scroll', handleScroll);
        }
    }, [isChatMode]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        // Switch to chat mode when first message is sent
        if (messages.length === 0) {
            setIsChatMode(true);
        }

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatWithKnowledgeBase(
                inputValue,
                knowledgeBaseContent,
                messages
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChatHistory = () => {
        setMessages([]);
        localStorage.removeItem('knowledgeBaseChatHistory');
        setIsChatMode(false);
        setShowInitialView(true);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleExploreClick = () => {
        if (mainContainerRef.current) {
            const heroHeight = heroRef.current?.offsetHeight || 0;
            mainContainerRef.current.scrollTo({
                top: heroHeight,
                behavior: 'smooth'
            });
        }
    };

    // Full-page chat view
    if (isChatMode) {
        return (
            <div className="flex h-full bg-white">
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="h-12 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Client Onboarding</span>
                        </div>
                        <button
                            onClick={clearChatHistory}
                            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 border border-gray-200"
                        >
                            End chat
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 max-w-4xl mx-auto w-full">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                                <div className={`max-w-[85%] px-5 py-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-black text-white rounded-br-sm'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-500 mb-6">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input - Fixed at bottom */}
                    <div className="border-t border-gray-200 px-8 py-4 bg-white">
                        <div className="max-w-4xl mx-auto flex items-center gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask follow up questions to ⊕ Pace"
                                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowUp className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Knowledge base view
    return (
        <div className="flex h-full bg-white">
            {/* Main Content Area */}
            <div ref={mainContainerRef} className="flex-1 overflow-y-auto relative">
                {/* Initial Hero View - Full Screen */}
                <div ref={heroRef} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
                    {/* Gradient Background Blobs */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-40 right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="relative z-10 text-center px-8 max-w-4xl">
                        <button
                            onClick={handleExploreClick}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-blue-200 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-all shadow-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Knowledge Base
                        </button>

                        <h1 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center justify-center gap-3">
                            Ask
                            <img src="/logooo.svg" alt="Pace Logo" className="h-8 w-8" />
                            Pace anything about Client Onboarding
                        </h1>

                        {/* Chat Input */}
                        <div className="max-w-3xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask away..."
                                    className="w-full px-6 py-4 pr-14 bg-white border border-gray-200 rounded-2xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-lg"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ArrowUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Explore Button */}
                        <button
                            onClick={handleExploreClick}
                            className="mt-16 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 mx-auto transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Explore Knowledge Base</span>
                        </button>
                    </div>
                </div>

                {/* Markdown Content */}
                <div ref={contentRef} className="min-h-screen bg-white">
                    {/* Content Header with Gradient */}
                    <div className="h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-10 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
                            <div className="absolute top-20 right-40 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-green-200 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative px-12 pt-16">
                            <h1 className="text-4xl font-bold text-gray-900">Client Onboarding</h1>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-12 py-8 pb-32">
                        <article className="prose prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                        return <h1 id={id} className="text-2xl font-bold mt-8 mb-4" {...props}>{children}</h1>;
                                    },
                                    h2: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                        return <h2 id={id} className="text-xl font-bold mt-6 mb-3" {...props}>{children}</h2>;
                                    },
                                    h3: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                        return <h3 id={id} className="text-lg font-semibold mt-4 mb-2" {...props}>{children}</h3>;
                                    },
                                }}
                            >
                                {knowledgeBaseContent}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Table of Contents - Only shows when scrolled */}
            {!showInitialView && (
                <aside className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-6">
                    <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                        In this Knowledge Base
                    </h3>
                    <nav className="space-y-1">
                        {tableOfContents.map((heading, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToSection(heading.id)}
                                className={`block w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors ${heading.level === 1 ? 'font-semibold' :
                                    heading.level === 2 ? 'pl-6' : 'pl-9 text-xs'
                                    }`}
                            >
                                {heading.text}
                            </button>
                        ))}
                    </nav>
                </aside>
            )}
        </div>
    );
};

export default KnowledgeBase;