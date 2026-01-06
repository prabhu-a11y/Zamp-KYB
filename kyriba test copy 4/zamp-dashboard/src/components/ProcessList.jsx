import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Check, Loader2 } from 'lucide-react';
import processesData from '../data/processes.json';

const ProcessList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Done');

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

    return (
        <div className="bg-white min-h-screen">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.status}
                        onClick={() => setActiveTab(tab.status)}
                        className={`flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${activeTab === tab.status
                            ? `${tab.bgColor} ${tab.color} ${tab.borderColor}`
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                            }`}
                    >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2">
                            <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                className={
                                    tab.name === 'Needs attention' ? "fill-red-50 stroke-red-400" :
                                        tab.name === 'Needs review' ? "fill-orange-50 stroke-orange-400" :
                                            tab.name === 'Void' ? "fill-gray-50 stroke-gray-400" :
                                                tab.name === 'In progress' ? "fill-blue-50 stroke-blue-400" :
                                                    "fill-green-100 stroke-green-700"
                                }
                                strokeWidth="1.5" />
                        </svg>
                        <span>{tab.name}</span>
                        <span className="text-gray-400">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Filter Button */}
            <div className="flex justify-between items-center px-6 pb-3">
                <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50 rounded border border-gray-200">
                    <Filter className="w-3 h-3" />
                    Filter
                </button>
            </div>

            {/* Conditional Rendering: Table or Empty State */}
            {currentProcesses.length > 0 ? (
                <div className="bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-t border-b border-gray-200">
                                    <th className="w-8 px-6 py-2"></th>
                                    <th className="px-4 py-2 text-left text-xs font-normal text-gray-500">
                                        Process Name
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-normal text-gray-500">
                                        Case Id
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-normal text-gray-500">
                                        Applicant Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-normal text-gray-500">
                                        Entity Name
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-normal text-gray-500">
                                        Receipt Date
                                    </th>
                                    <th className="px-6 py-2 text-left text-xs font-normal text-gray-500">
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
                                            <span className="text-xs text-gray-600">{process.year}</span>
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
                <div className="px-6">
                    {renderEmptyState(activeTab)}
                </div>
            )}
        </div>
    );
};

export default ProcessList;