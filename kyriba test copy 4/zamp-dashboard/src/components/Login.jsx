import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkIcon from '../assets/file.svg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lines, setLines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Generate random animated lines
        const generateLines = () => {
            const newLines = [];
            const lineCount = 8;

            for (let i = 0; i < lineCount; i++) {
                const isHorizontal = Math.random() > 0.5;
                const startPos = Math.random() * 100;
                const duration = 6 + Math.random() * 8; // 6-14 seconds
                const delay = Math.random() * 4;
                const opacity = 0.15 + Math.random() * 0.25; // 0.15-0.4

                newLines.push({
                    id: i,
                    isHorizontal,
                    startPos,
                    duration,
                    delay,
                    opacity
                });
            }

            setLines(newLines);
        };

        generateLines();

        // Regenerate lines periodically for variety
        const interval = setInterval(generateLines, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'user@zamp.ai' && password === 'demo123') {
            navigate('/done');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Static Grid */}
                <div
                    className="absolute inset-0 animate-grid-flow"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Dynamic Moving Lines */}
                {lines.map((line) => (
                    <div
                        key={line.id}
                        className={`absolute ${line.isHorizontal ? 'left-0 right-0 h-[2px]' : 'top-0 bottom-0 w-[2px]'}`}
                        style={{
                            [line.isHorizontal ? 'top' : 'left']: `${line.startPos}%`,
                            background: line.isHorizontal
                                ? `linear-gradient(to right, transparent, rgba(0,0,0,${line.opacity}) 50%, transparent)`
                                : `linear-gradient(to bottom, transparent, rgba(0,0,0,${line.opacity}) 50%, transparent)`,
                            animation: line.isHorizontal
                                ? `moveHorizontal ${line.duration}s linear infinite`
                                : `moveVertical ${line.duration}s linear infinite`,
                            animationDelay: `${line.delay}s`
                        }}
                    />
                ))}

                {/* Pulsing Grid Intersections */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`pulse-${i}`}
                            className="absolute w-2 h-2 bg-gray-400 rounded-full"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 3) * 20}%`,
                                animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
                                animationDelay: `${i * 0.5}s`,
                                opacity: 0.3
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-[540px] w-full p-12 bg-white rounded-2xl shadow-sm relative z-10">
                <div className="flex items-center gap-2 mb-10">
                    <span className="text-3xl font-bold text-black tracking-tight">zamp</span>
                    <img src={checkIcon} alt="check" className="w-8 h-8" />
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-0 transition-colors"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-0 transition-colors"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-[#2d3748] hover:bg-[#1a202c] text-white text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 mt-2"
                    >
                        Login
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes moveHorizontal {
                    0% {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    95% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                @keyframes moveVertical {
                    0% {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    95% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.2;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;