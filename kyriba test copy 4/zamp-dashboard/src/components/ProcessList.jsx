import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Check, Loader2 } from 'lucide-react';

const ZAMP_API_URL = import.meta.env.VITE_API_URL || "";

const ProcessList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Done');
    const [processesData, setProcessesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await fetch(`${ZAMP_API_URL}/zamp/app-data/processes.json`);
                if (response.ok) {
                    const data = await response.json();
                    setProcessesData(data);
                }
            } catch (error) {
                console.error("Error fetching processes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProcesses();
        const interval = setInterval(fetchProcesses, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Filter processes based on active tab
    const getProcessesByStatus = (status) => {
        return processesData.filter(p => p.status === status);
    };

    const tabs = [
        { name: 'Needs attention', status: 'Needs Attention', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-100', squareBg: 'bg-red-50', squareBorder: 'border-red-400' },
        { name: 'Needs review', status: 'Needs Review', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100', squareBg: 'bg-orange-50', squareBorder: 'border-orange-400' },
        { name: 'Void', status: 'Void', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', squareBg: 'bg-gray-50', squareBorder: 'border-gray-400' },
        { name: 'In progress', status: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', squareBg: 'bg-blue-50', squareBorder: 'border-blue-400' },
        { name: 'Done', status: 'Done', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', squareBg: 'bg-green-50', squareBorder: 'border-green-700' },
    ].map(tab => ({
        ...tab,
        count: getProcessesByStatus(tab.status).length
    }));

    const currentProcesses = getProcessesByStatus(activeTab);

    const emptyStates = {
        'Needs Attention': {
            icon: '/file1.svg',
            title: 'No blockers right now',
            description: "Sit back and let things flow, we'll nudge you when it's time to step in."
        },
        'Void': {
            icon: '/file2.svg',
            title: 'Nothing to see here yet',
            description: 'Any process that is void will land here.'
        },
        'In Progress': {
            icon: '/file3.svg',
            title: 'All clear for now',
            description: 'Looks like a quiet moment. Maybe grab a coffee?'
        },
        'Done': {
            icon: '/file3.svg',
            title: 'No completed processes',
            description: 'Completed processes will appear here.'
        },
        'Needs Review': {
            icon: '/file2.svg',
            title: 'No pending reviews',
            description: 'Processes needing review will appear here.'
        }
    };

    const renderEmptyState = (tabName) => {
        const state = emptyStates[tabName] || emptyStates['Done'];
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] bg-white">
                <img src={state.icon} alt={tabName} className="w-40 h-40 mb-6" />
                <h3 className="text-md font-medium text-gray-900 mb-2">{state.title}</h3>
                <p className="text-sm text-gray-500 text-center max-w-md">{state.description}</p>
            </div>
        );
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Tabs Bar */}
            <div className="flex items-center gap-3 px-8 pt-6 pb-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.status}
                        onClick={() => setActiveTab(tab.status)}
                        className={`flex items-center gap-2 py-1.5 transition-all duration-200 rounded-lg ${activeTab === tab.status
                            ? `px-3 bg-gray-100/60 text-gray-900 ring-1 ring-gray-200/50 shadow-sm`
                            : 'bg-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className={`w-2.5 h-2.5 rounded-[3px] border ${tab.name === 'Needs attention' ? "bg-red-100 border-red-500" :
                            tab.name === 'Needs review' ? "bg-orange-100 border-orange-500" :
                                tab.name === 'Void' ? "bg-gray-200 border-gray-400" :
                                    tab.name === 'In progress' ? "bg-blue-100 border-blue-500" :
                                        "bg-green-100 border-green-600"
                            }`} />
                        <span className="text-[13px] font-medium leading-none">{tab.name}</span>
                        <span className="text-[13px] text-gray-400 font-medium ml-0.5">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Filter Button Row */}
            <div className="flex justify-between items-center px-8 py-2 border-t border-gray-50">
                <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                </button>

                {/* Secondary filter icon on the right */}
                <button className="p-1.5 text-gray-400 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                </button>
            </div>

            {/* Conditional Rendering: Table or Empty State */}
            {currentProcesses.length > 0 ? (
                <div className="bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-t border-b border-gray-50">
                                    <th className="w-12 px-8 py-3"></th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Current Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Case Id
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Applicant Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Entity Name
                                    </th>
                                    <th className="px-4 py-3 text-center text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Receipt Date
                                    </th>
                                    <th className="px-8 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {currentProcesses.map((process) => (
                                    <tr
                                        key={process.id}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/done/process/${process.id}`)}
                                    >
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {process.status === 'Done' ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-green-600" />
                                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                                                            <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                                className="fill-green-100 stroke-green-700"
                                                                strokeWidth="1.5" />
                                                        </svg>
                                                    </>
                                                ) : process.status === 'In Progress' ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                                                            <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                                className="fill-blue-100 stroke-blue-700"
                                                                strokeWidth="1.5" />
                                                        </svg>
                                                    </>
                                                ) : process.status === 'Needs Attention' ? (
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                                                        <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                            className="fill-red-50 stroke-red-400"
                                                            strokeWidth="1.5" />
                                                    </svg>
                                                ) : process.status === 'Needs Review' ? (
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                                                        <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                            className="fill-orange-50 stroke-orange-400"
                                                            strokeWidth="1.5" />
                                                    </svg>
                                                ) : (
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                                                        <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                            className="fill-gray-50 stroke-gray-400"
                                                            strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-2 text-xs text-gray-900 text-left">
                                            Wio Onboarding Application
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-center text-xs text-gray-900">
                                            {process.id}
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-left">
                                            <span className="text-xs text-gray-900 font-medium">{process.customerName || process.applicantName || process.name || "Wio Applicant"}</span>
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-left">
                                            <span className="text-xs text-gray-900 font-medium">{process.entityName || "—"}</span>
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-center">
                                            <span className="text-xs text-gray-600">{process.processingDate || process.year}</span>
                                        </td>

                                        <td className="px-6 py-2 whitespace-nowrap">
                                            <span className="text-xs text-gray-900">{process.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {renderEmptyState(activeTab)}
                </div>
            )}
        </div>
    );
};

export default ProcessList;