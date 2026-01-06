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
    Menu
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
                    <div className="h-12 flex items-center justify-between px-3">
                        <img src={checkIcon} alt="check" className="w-6 h-6" />
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
                                    `flex items-center px-3 py-1.5 text-xs ${isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`
                                }
                            >
                                <Users className="w-3.5 h-3.5 mr-2.5" />
                                People
                            </NavLink>
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
                                <div className="w-5 h-5 bg-pink-200 rounded text-[10px] flex items-center justify-center text-pink-700 font-bold mr-2.5">
                                    W
                                </div>
                                Wio
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
                <header className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white relative">
                    <div className="flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <PanelLeft className="w-4 h-4" />
                            </button>
                        )}

                        <div className="flex items-center gap-2 text-xs">
                            {isProcessDetailPage && (
                                <>
                                    <button
                                        onClick={() => navigate('/done')}
                                        className="hover:bg-gray-100 rounded p-1 -ml-1"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                    <span className="text-gray-500">Client Onboarding</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-gray-900 font-medium">Activity Logs</span>
                                </>
                            )}
                            {!isProcessDetailPage && (
                                <span className="text-gray-900 font-medium">Client Onboarding</span>
                            )}
                        </div>
                    </div>

                    {/* Centered Work with Pace */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                        <span className="text-[11px] text-gray-500">Work with Pace</span>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 rounded">
                            K
                        </kbd>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/done/knowledge-base')}
                            className="p-1.5 hover:bg-gray-50 rounded border border-gray-200"
                        >
                            <BookOpen className="w-4 h-4 text-gray-600" />
                        </button>

                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-700 hover:bg-gray-50 rounded font-medium border border-gray-200">
                            Share
                        </button>
                    </div>

                    {/* Curved corner - only when sidebar is open */}
                    {isSidebarOpen && (
                        <div className="absolute left-0 top-0 w-4 h-4 pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 16C0 7.163 7.163 0 16 0V16H0Z" fill="#F9FAFB" />
                            </svg>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 h-full bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;