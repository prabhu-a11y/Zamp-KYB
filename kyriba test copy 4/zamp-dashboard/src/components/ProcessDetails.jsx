import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Video, Database, ChevronUp, ChevronDown, Check, Maximize2, Loader2, Star, MonitorPlay, Image as ImageIcon, Table as TableIcon, Send } from 'lucide-react';


const CollapsibleReasoning = ({ reasons }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Demo Injection: If no reasons provided, but it's a specific step, inject some for demo
    // content: reasons || (logTitle.includes("Customer validation") ? ["Customer has 13 past transactions with the merchant"] : [])
    // But here we only have access to 'reasons' prop. Logic belongs in parent or data.

    if (!reasons || reasons.length === 0) return null;

    return (
        <div className="mt-2 mb-3 max-w-md animate-fade-in">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors ${isOpen ? 'rounded-t text-gray-900 bg-gray-50' : 'rounded shadow-sm'}`}
            >
                <span className="font-medium">See reasoning</span>
                {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {isOpen && (
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-b border-t-0 shadow-sm">
                    <div className="space-y-2">
                        {reasons.map((r, i) => (
                            <div key={i} className="flex gap-3 text-xs text-gray-600 leading-relaxed">
                                <span className="text-gray-300 select-none">└</span>
                                <span>{r}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Zamp Integration Helpers ---
const ZAMP_API_URL = import.meta.env.VITE_API_URL || "";

const ReviewActions = ({ processId, messages, refresh, rejectionReasons = [], onArtifactClick }) => {
    const [showChat, setShowChat] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [msgText, setMsgText] = useState("");
    const [sending, setSending] = useState(false);
    const [rejectionEmail, setRejectionEmail] = useState("");

    // Auto-generate rejection email when modal opens
    const openRejectModal = () => {
        // Check if there are specific issues detected
        const hasDetectedIssues = rejectionReasons && rejectionReasons.length > 0;

        const reasonsList = hasDetectedIssues
            ? rejectionReasons.map(r => `• ${r}`).join('\n')
            : '• [Please specify reason for rejection]';

        const defaultEmail = `Dear Applicant,

Thank you for your interest in opening an account with Wio Bank.

After careful review of your application and supporting documents, we regret to inform you that we are unable to proceed with your account opening request at this time.

Reason for Rejection:
${reasonsList}

If you believe this decision was made in error or if you have additional documentation to provide, please do not hesitate to contact us.

We appreciate your understanding.

Best regards,
Wio Bank Onboarding Team`;
        setRejectionEmail(defaultEmail);
        setShowRejectModal(true);
    };

    const handleSendMessage = async () => {
        if (!msgText.trim()) return;
        setSending(true);
        try {
            await fetch(`${ZAMP_API_URL}/zamp/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processId: processId,
                    sender: "Zamp",
                    content: msgText
                })
            });
            setMsgText("");
        } catch (e) {
            console.error(e);
        }
        setSending(false);
    };

    const handleApprove = async () => {
        if (!window.confirm("Approve this application?")) return;
        try {
            await fetch(`${ZAMP_API_URL}/zamp/approve/${processId}`, { method: 'POST' });
        } catch (e) {
            console.error(e);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Reject this application and send the email?")) return;
        try {
            await fetch(`${ZAMP_API_URL}/zamp/reject/${processId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: rejectionEmail,
                    reason: "Application rejected after manual review"
                })
            });
            setShowRejectModal(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            {/* Messages Area - Compact */}
            {messages.length > 0 && (
                <div className="mb-3 bg-gray-50 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === "Zamp" ? "items-end" : "items-start"}`}>
                            <div className="text-[10px] text-gray-400 mb-0.5">{msg.sender === "Zamp" ? "You" : "Applicant"} • {msg.time}</div>
                            <div className={`px-2 py-1.5 rounded text-xs max-w-[85%] ${msg.sender === "Zamp" ? "bg-black text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                }`}>
                                {msg.content}
                            </div>
                            {msg.attachment && onArtifactClick && (
                                <button
                                    onClick={() => onArtifactClick(msg.attachment)}
                                    className="mt-1.5 inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{msg.attachment.label}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!showChat && !showRejectModal ? (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setShowChat(true)}
                        className="px-4 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        Ask questions
                    </button>
                    <button
                        onClick={openRejectModal}
                        className="px-4 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        Reject
                    </button>
                    <button
                        onClick={handleApprove}
                        className="px-4 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-all"
                    >
                        Approve
                    </button>
                </div>
            ) : showRejectModal ? (
                <div className="animate-fade-in">
                    <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">Rejection Email Draft</span>
                    </div>
                    <textarea
                        value={rejectionEmail}
                        onChange={(e) => setRejectionEmail(e.target.value)}
                        className="w-full h-48 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleReject}
                            className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-all"
                        >
                            Send Rejection
                        </button>
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-center animate-fade-in">
                    <input
                        type="text"
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        placeholder="Type question..."
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending}
                        className="p-1.5 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                        {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </button>
                    <button
                        onClick={() => setShowChat(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline px-1"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

const ProcessDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null); // New: for inline artifact panel
    const [allProcessIds, setAllProcessIds] = useState([]);
    const [liveStatus, setLiveStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from new backend endpoint instead of static file
                const response = await fetch(`${ZAMP_API_URL}/zamp/app-data/process_${id}.json`);
                if (!response.ok) {
                    throw new Error('Process data not found');
                }
                const jsonData = await response.json();
                setData(jsonData);

                // Fetch live status is now redundant as main fetch gets latest, but keeping for compatibility if needed.
                // We can trust the main fetch now as it comes from DB.
                // But for polling status updates specifically, the status endpoint is lighter.
                const statusRes = await fetch(`${ZAMP_API_URL}/zamp/status/${id}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    setLiveStatus(statusData.status);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching process data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();

        // Poll for updates every 2 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);
    }, [id]);

    // Fetch all available process IDs
    useEffect(() => {
        const fetchAllProcesses = async () => {
            try {
                // Fetch from new backend endpoint
                const response = await fetch(`${ZAMP_API_URL}/zamp/app-data/processes.json`);
                if (response.ok) {
                    const processes = await response.json();
                    const ids = processes.map(p => p.id).sort((a, b) => a - b);
                    setAllProcessIds(ids);
                }
            } catch (err) {
                console.error("Error fetching process list:", err);
            }
        };

        fetchAllProcesses();

        // Also poll the process list every 2 seconds for new processes
        const processListInterval = setInterval(() => {
            fetchAllProcesses();
        }, 2000);

        return () => clearInterval(processListInterval);
    }, []);

    const currentIndex = allProcessIds.indexOf(parseInt(id));
    const canGoUp = currentIndex > 0;
    const canGoDown = currentIndex < allProcessIds.length - 1;

    const handleNavigateUp = () => {
        if (canGoUp) {
            navigate(`/done/process/${allProcessIds[currentIndex - 1]}`);
        }
    };

    const handleNavigateDown = () => {
        if (canGoDown) {
            navigate(`/done/process/${allProcessIds[currentIndex + 1]}`);
        }
    };

    const getIconComponent = (iconType) => {
        switch (iconType) {
            case 'file': return FileText;
            case 'video': return Video;
            case 'dashboard': return Database;
            case 'image': return ImageIcon;
            case 'table': return TableIcon;
            default: return FileText;
        }
    };

    // Find associated extracted data for a document artifact
    const findAssociatedData = (artifact, allLogs) => {
        // If artifact already has data, use it
        if (artifact.data) return artifact.data;

        // Look through logs to find matching extracted data
        for (const log of allLogs) {
            if (!log.artifacts) continue;

            // Check if this log contains our artifact
            const hasArtifact = log.artifacts.some(a => a.id === artifact.id);
            if (hasArtifact) {
                // Find table artifacts in the same log entry (extracted data)
                const dataArtifact = log.artifacts.find(a =>
                    a.type === 'table' && a.data && a.id !== artifact.id
                );
                if (dataArtifact) return dataArtifact.data;
            }
        }
        return null;
    };

    const handleArtifactClick = (artifact) => {
        // Get logs for data lookup
        const allLogs = data?.sections?.activityLogs?.items || data?.logs || [];
        const associatedData = findAssociatedData(artifact, allLogs);

        // Set artifact with associated data
        setSelectedArtifact({
            ...artifact,
            extractedData: associatedData
        });
    };

    const closeArtifactPanel = () => {
        setSelectedArtifact(null);
    };

    if (loading && !data) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    if (!data) return null;

    const { sections } = data;

    // Handle both old and new data structures
    const logs = sections?.activityLogs?.items || data.logs || [];
    const keyDetails = sections?.keyDetails?.items ? sections.keyDetails : (data.keyDetails || {
        processName: "Unknown",
        team: "Unknown",
        processingDate: "Unknown",
        status: "Unknown"
    });

    const sidebarArtifacts = sections?.sidebarArtifacts?.items || data.sidebarArtifacts || [];

    // Status Determination
    // Use liveStatus from API if available, otherwise fall back to file data
    const keyDetailItems = sections?.keyDetails?.items || [];
    const firstDetailItem = keyDetailItems.length > 0 ? keyDetailItems[0] : {};
    const latestStatusItem = keyDetailItems.length > 0 ? keyDetailItems[keyDetailItems.length - 1] : null;
    const fileStatus = latestStatusItem?.status || keyDetails.status || "Unknown";
    const processStatus = liveStatus && liveStatus !== "Unknown" ? liveStatus : fileStatus;

    // Extract customer/entity details for sidebar
    const customerName = firstDetailItem.customerName || keyDetails.customerName || "";
    const entityName = firstDetailItem.entityName || keyDetails.entityName || "";
    const processingDate = firstDetailItem.processingDate || keyDetails.processingDate || new Date().toISOString().split('T')[0];

    return (
        <div className="flex h-screen bg-white">
            {/* Left Pane - Main Content (shrinks when artifact is selected) */}
            <div className={`flex flex-col overflow-hidden border-r border-gray-200 transition-all duration-300 ${selectedArtifact ? 'w-[1000px]' : 'flex-1'}`}>
                {/* Process ID Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Case #</span>
                            <span className="font-semibold text-xs">{id}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${processStatus === 'Complete' || processStatus === 'success' || processStatus === 'Done' ? 'text-green-700 border-green-200 bg-green-50' :
                            processStatus === 'Needs Review' || processStatus === 'Under Review' ? 'text-orange-700 border-orange-200 bg-orange-50' :
                                'text-blue-700 border-blue-200 bg-blue-50'
                            }`}>
                            {(processStatus === 'Complete' || processStatus === 'success' || processStatus === 'Done') ? <Check className="h-3 w-3 text-green-600" /> :
                                (processStatus === 'Needs Review' || processStatus === 'Under Review') ? <Loader2 className="h-3 w-3 text-orange-600 animate-spin" /> :
                                    <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />}
                            <span>{processStatus === 'Complete' ? 'Done' : processStatus === 'processing' ? 'In Progress' : processStatus}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{currentIndex + 1} / {allProcessIds.length}</span>
                        <button
                            onClick={handleNavigateUp}
                            disabled={!canGoUp}
                            className={`p-1 h-7 w-7 rounded hover:bg-gray-100 ${!canGoUp ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronUp className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNavigateDown}
                            disabled={!canGoDown}
                            className={`p-1 h-7 w-7 rounded hover:bg-gray-100 ${!canGoDown ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="flex-1 overflow-y-auto">
                    {/* Today Divider */}
                    <div className="flex items-center py-6 px-8">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-500 font-medium">Today</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="max-w-3xl">
                            {logs.map((log, index) => {
                                const isLastItem = index === logs.length - 1;
                                const isComplete = log.status !== 'processing';

                                return (
                                    <div key={log.id} className="relative pb-12">
                                        <div className="relative flex gap-4">
                                            {/* Time */}
                                            <div className="w-20 flex-shrink-0 text-right">
                                                <span className="text-xs text-gray-500">{log.time}</span>
                                            </div>

                                            {/* Timeline Icon */}
                                            <div className="relative flex flex-col items-center">
                                                <div className="relative z-10 bg-white">
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mt-1">
                                                        <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="2"
                                                            className={isComplete ? "fill-green-100 stroke-green-700" : "fill-blue-100 stroke-blue-700"}
                                                            strokeWidth="1.5" />
                                                    </svg>
                                                </div>
                                                {!isLastItem && (
                                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px bg-gray-200" style={{ height: 'calc(100% + 5rem)' }}></div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 -mt-0.5">
                                                <h3 className="text-xs font-normal text-gray-900 mb-2">{log.title}</h3>

                                                {/* Reasoning Section */}
                                                <CollapsibleReasoning reasons={log.reasoning} />

                                                {/* Artifacts */}
                                                {log.artifacts && log.artifacts.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {log.artifacts.map((artifact) => {
                                                            const IconComponent = getIconComponent(artifact.icon);
                                                            return (
                                                                <button
                                                                    key={artifact.id}
                                                                    onClick={() => handleArtifactClick(artifact)}
                                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                                                >
                                                                    <IconComponent className="h-3.5 w-3.5 text-gray-400" />
                                                                    <span>{artifact.label}</span>
                                                                    {artifact.icon === 'dashboard' && (
                                                                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Review Decision Entry - Integrated into Timeline */}
                            {(processStatus === 'Needs Review' || processStatus === 'Under Review') && (
                                <div className="relative pb-12">
                                    <div className="relative flex gap-4">
                                        {/* Time */}
                                        <div className="w-20 flex-shrink-0 text-right">
                                            <span className="text-xs text-gray-500">Now</span>
                                        </div>

                                        {/* Timeline Icon - Orange diamond for pending decision */}
                                        <div className="relative flex flex-col items-center">
                                            {/* Connector line from above */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px bg-gray-200" style={{ height: '5rem' }}></div>
                                            <div className="relative z-10 bg-white">
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mt-1" style={{ transform: 'rotate(45deg)' }}>
                                                    <rect x="1" y="1" width="8" height="8" rx="1" className="fill-orange-100 stroke-orange-500" strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 -mt-0.5">
                                            <h3 className="text-xs font-medium text-gray-900 mb-2">Manual Review Required</h3>

                                            {/* Reasoning Section */}
                                            <CollapsibleReasoning reasons={[
                                                "Application flagged for human verification",
                                                "All automated checks completed successfully",
                                                "KYC/AML review recommended before final approval",
                                                "Verify shareholder information matches submitted documents",
                                                "Confirm business activities align with stated purpose"
                                            ]} />

                                            {/* Decision Actions */}
                                            <div className="mt-4">
                                                <ReviewActions
                                                    processId={id}
                                                    messages={sections?.messages?.items || []}
                                                    refresh={Math.random()}
                                                    rejectionReasons={[
                                                        // These would typically come from detected issues
                                                        // Empty array = no issues detected, prompts user input
                                                    ]}
                                                    onArtifactClick={handleArtifactClick}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Key Details (hidden when artifact selected) */}
            {!selectedArtifact && (
                <aside className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
                    <div className="p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-400" />
                                Key Details
                            </h2>
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <Maximize2 className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Case Details Section */}
                        <div className="mb-5">
                            <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Case Details</h3>
                            <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Application ID</span>
                                    <span className="text-gray-900 font-medium">WIO-{id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Customer Name</span>
                                    <span className="text-gray-900 font-medium">{customerName || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Entity Name</span>
                                    <span className="text-gray-900 font-medium">{entityName || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Submitted</span>
                                    <span className="text-gray-900 font-medium">{processingDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-medium ${processStatus === 'Complete' || processStatus === 'Done' ? 'text-green-600' : processStatus === 'Needs Review' ? 'text-orange-600' : 'text-blue-600'}`}>
                                        {processStatus === 'Complete' ? 'Approved' : processStatus === 'processing' ? 'In Progress' : processStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-5"></div>

                        {/* Dynamic Extra Details */}
                        {keyDetailItems.length > 0 && (
                            <div className="mb-5">
                                <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Additional Information</h3>
                                <div className="space-y-2.5 text-xs">
                                    {keyDetailItems.flatMap((item, itemIdx) =>
                                        Object.entries(item).map(([key, value], entryIdx) => {
                                            // Skip fields already shown in the top section or internal fields
                                            if (['customerName', 'entityName', 'processingDate', 'status', 'id', 'title'].includes(key)) return null;

                                            // Format key: camelCase to Title Case
                                            const label = key
                                                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                                                .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                                                .trim();

                                            return (
                                                <div key={`${itemIdx}-${entryIdx}`} className="flex justify-between">
                                                    <span className="text-gray-500 capitalize">{label}</span>
                                                    <span className="text-gray-900 font-medium text-right ml-4 break-words max-w-[200px]">{value}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="border-t border-gray-200 my-5"></div>
                            </div>
                        )}

                        {/* Artifacts Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MonitorPlay className="h-4 w-4 text-gray-700" />
                                Artifacts
                            </h3>
                            <div className="flex flex-col gap-2 items-start">
                                {sidebarArtifacts.map((artifact) => {
                                    const IconComponent = getIconComponent(artifact.icon);
                                    return (
                                        <button
                                            key={artifact.id}
                                            onClick={() => handleArtifactClick(artifact)}
                                            className="inline-flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-left border border-gray-200 bg-gray-100"
                                        >
                                            <IconComponent className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                                            <span className="text-xs text-gray-700">{artifact.label}</span>
                                            {artifact.icon === 'dashboard' && (
                                                <svg className="h-3 w-3 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Center Pane - Extracted Data (when artifact selected) */}
            {selectedArtifact && (selectedArtifact.data || selectedArtifact.extractedData) && (
                <div className="w-[300px] border-r border-gray-200 bg-white flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Extracted Information</h3>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        {(() => {
                            const displayData = selectedArtifact.extractedData || selectedArtifact.data;
                            if (!displayData) return null;

                            if (Array.isArray(displayData)) {
                                return (
                                    <div className="space-y-3">
                                        {displayData.map((item, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                {Object.entries(item).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-xs py-1">
                                                        <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="text-gray-900 font-medium">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-2">
                                    {Object.entries(displayData || {}).filter(([key]) => !key.includes('video_path') && !key.includes('public_video')).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-500 w-2/5">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())}</span>
                                            <span className="text-gray-900 font-medium text-right w-3/5">{value !== null && value !== undefined ? (Array.isArray(value) ? JSON.stringify(value) : value.toString()) : '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Right Pane - Document Viewer (when artifact selected) */}
            {selectedArtifact && (
                <div className="flex-1 min-w-[500px] bg-gray-50 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                        <h3 className="text-sm font-medium text-gray-900">Document</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={closeArtifactPanel} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Document Content */}
                    <div className="flex-1 overflow-auto p-4">
                        {selectedArtifact.type === 'video' && selectedArtifact.videoPath && (
                            <video controls autoPlay className="w-full rounded shadow-sm" src={selectedArtifact.videoPath}>
                                Your browser does not support the video tag.
                            </video>
                        )}

                        {selectedArtifact.type === 'file' && selectedArtifact.pdfPath && (
                            <iframe
                                src={selectedArtifact.pdfPath}
                                className="w-full h-full min-h-[600px] rounded border border-gray-200 bg-white"
                                title={selectedArtifact.label}
                            />
                        )}

                        {selectedArtifact.type === 'image' && selectedArtifact.imagePath && (
                            <div className="flex justify-center">
                                <img src={selectedArtifact.imagePath} alt={selectedArtifact.label} className="max-w-full rounded shadow-sm" />
                            </div>
                        )}

                        {selectedArtifact.type === 'table' && selectedArtifact.data && !selectedArtifact.pdfPath && !selectedArtifact.imagePath && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-4">{selectedArtifact.label}</h4>
                                <div className="text-xs text-gray-500">Data displayed in center panel</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessDetails;