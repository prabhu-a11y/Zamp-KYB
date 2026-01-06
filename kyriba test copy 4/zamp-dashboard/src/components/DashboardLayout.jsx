import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import checkIcon from '../assets/file.svg';
import {
    Layout,
    ChevronDown,
    FileText,
    Settings,
    User,
    Database,
    Users,
    PanelLeft,
    Share2,
    BookOpen,
    LogOut,
    ArrowLeft,
    ChevronRight,
    Menu,
    MessageSquare,
    Plus,
    Box
} from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAirbnbOpen, setIsAirbnbOpen] = useState(false);

    const isProcessDetailPage = location.pathname.includes('/process/');

    const handleLogout = () => {
        setIsAirbnbOpen(false);
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="w-[230px] bg-white flex flex-col flex-shrink-0 transition-all duration-300 relative border-r border-gray-200">
                    {/* Logo Area */}
                    <div className="h-12 flex items-center justify-between px-4">
                        <img src="/logooo.svg" alt="Pace Logo" className="h-7 w-auto" />
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <PanelLeft className="w-4 h-4" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-3">
                        <div className="space-y-0.5">
                            <a href="#" className="flex items-center px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                                <Database className="w-3.5 h-3.5 mr-2.5" />
                                Data
                            </a>
                            <NavLink
                                to="/done/people"
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 text-sm ${isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`
                                }
                            >
                                <Users className="w-4 h-4 mr-3" />
                                People
                            </NavLink>
                            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                <Box className="w-4 h-4 mr-3" />
                                Pace
                            </a>
                        </div>
                        <div className="mt-5">
                            <div className="px-3 text-[10px] font-medium text-gray-400 tracking-wider mb-1.5" style={{ textTransform: 'capitalize' }}>
                                Processes
                            </div>
                            <NavLink
                                to="/done"
                                className={({ isActive }) =>
                                    `flex items-center px-2.5 py-1.5 text-xs ${isActive ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
                                }
                            >
                                <img src="/random.svg" alt="process icon" className="w-6.5 h-6.5 mr-2.5" />
                                Client Onboarding
                            </NavLink>
                        </div>

                        <div className="mt-5">
                            <div className="px-3 text-[10px] font-medium text-gray-400 tracking-wider mb-1.5" style={{ textTransform: 'capitalize' }}>
                                Pages
                            </div>
                            <button className="w-full flex items-center justify-center px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                                <span className="text-lg font-light">+</span>
                            </button>
                        </div>
                    </nav>

                    {/* Bottom Airbnb Section */}
                    <div className="border-t border-gray-200 relative">
                        <button
                            onClick={() => setIsAirbnbOpen(!isAirbnbOpen)}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50"
                        >
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-yellow-100 rounded text-[11px] flex items-center justify-center text-yellow-700 font-bold mr-2.5">
                                    A
                                </div>
                                AP Demo Org
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isAirbnbOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isAirbnbOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="py-1">
                                    <button
                                        className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                        onClick={() => setIsAirbnbOpen(false)}
                                    >
                                        <div className="w-5 h-5 bg-pink-200 rounded text-[10px] flex items-center justify-center text-pink-700 font-bold mr-2.5">
                                            W
                                        </div>
                                        Wio
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                    >
                                        <LogOut className="w-3.5 h-3.5 mr-2.5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white relative">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <PanelLeft className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex items-center gap-2">
                            <span className="text-[17px] font-bold text-gray-900 tracking-tight">
                                {isProcessDetailPage ? "Activity Logs" : "Client Onboarding"}
                            </span>
                        </div>
                    </div>

                    {/* Centered Work with Pace */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 bg-gray-50/50 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-1.5 opacity-70">
                            <Plus className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] font-medium text-gray-500">Work with Pace</span>
                        </div>
                        <div className="flex items-center gap-1 ml-1">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">
                                ⌘
                            </kbd>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">
                                K
                            </kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button className="p-1.5 hover:bg-gray-50 border-r border-gray-200 text-gray-500">
                                <BookOpen className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-50 text-gray-500">
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status Badges from Reference */}
                        <div className="flex items-center gap-1.5 px-1 py-1 bg-gray-50/50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-1 px-1.5 py-0.5">
                                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">C</div>
                                <span className="text-[11px] font-bold text-gray-600">9</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200"></div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5">
                                <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center text-[10px] text-white font-bold">L</div>
                                <span className="text-[11px] font-bold text-gray-600">2</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200"></div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5">
                                <div className="w-4 h-4 bg-orange-400 rounded flex items-center justify-center text-[10px] text-white font-bold">S</div>
                                <span className="text-[11px] font-bold text-gray-600">1</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200"></div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5">
                                <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                                <span className="text-[11px] font-bold text-gray-600">1</span>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                            Share
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-hidden p-6 bg-gray-50 flex flex-col">
                    <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;