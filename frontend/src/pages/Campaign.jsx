import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MessageSquare, Filter, Clock, TrendingUp, Star, Eye, ChevronRight, Activity, Users, Target, Mail } from "lucide-react";

export default function Campaign() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaignLogs, setSelectedCampaignLogs] = useState(null);
    const [logsLoading, setLogsLoading] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://xeno-crm-omega.vercel.app/api/campaigns", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const sortedCampaigns = res.data.sort((a, b) =>
                    new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
                );

                setCampaigns(sortedCampaigns);
            } catch (err) {
                console.error("Failed to fetch campaigns:", err);
                alert("Error fetching campaigns");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const getRecentCampaigns = () => {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        return campaigns.filter(campaign =>
            new Date(campaign.createdAt || campaign.created_at) > threeDaysAgo
        );
    };

    const getMostRecentCampaign = () => {
        if (campaigns.length === 0) return null;
        return campaigns[0]; // Already sorted by creation date
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-blue-100 text-blue-800 border-blue-200';
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'paused': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'completed': return 'bg-slate-100 text-slate-800 border-slate-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Activity className="h-3 w-3" />;
            case 'paused': return <Clock className="h-3 w-3" />;
            case 'completed': return <Target className="h-3 w-3" />;
            default: return <Activity className="h-3 w-3" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const fetchLogs = async (campaignId) => {
        setLogsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`https://xeno-crm-omega.vercel.app/api/logs/${campaignId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedCampaignLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch campaign logs:", err);
            alert("Error fetching logs");
        } finally {
            setLogsLoading(false);
        }
    };

    const recentCampaigns = getRecentCampaigns();
    const mostRecentCampaign = getMostRecentCampaign();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Campaign Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">Monitor and manage your marketing campaigns with ease</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Campaigns</p>
                                <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                                <p className="text-xs text-gray-500 mt-1">All time</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <MessageSquare className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {campaigns.filter(c => c.status === 'active').length || campaigns.length}
                                </p>
                                <p className="text-xs text-emerald-600 mt-1">Running now</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Recent</p>
                                <p className="text-3xl font-bold text-purple-600">{recentCampaigns.length}</p>
                                <p className="text-xs text-purple-600 mt-1">Last 3 days</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                <Clock className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Rules</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {campaigns.reduce((sum, c) => sum + c.rules.length, 0)}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">Targeting rules</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                                <Filter className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Most Recent Campaign Highlight */}
                {mostRecentCampaign && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-amber-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Most Recent Campaign</h2>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1 rounded-2xl shadow-xl">
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(mostRecentCampaign.status || 'active')}`}>
                                            {getStatusIcon(mostRecentCampaign.status || 'active')}
                                            {mostRecentCampaign.status ? mostRecentCampaign.status.charAt(0).toUpperCase() + mostRecentCampaign.status.slice(1) : 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(mostRecentCampaign.createdAt || mostRecentCampaign.created_at)}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-900 text-lg leading-relaxed font-medium">
                                        {mostRecentCampaign.message}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>{mostRecentCampaign.rules.length} targeting rules</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <span>Email campaign</span>
                                        </div>
                                    </div>
                                    <button
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                        onClick={() => fetchLogs(mostRecentCampaign._id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Logs
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* All Campaigns Grid */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">All Campaigns</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {campaigns.map((campaign) => (
                        <div key={campaign._id} className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status || 'active')}`}>
                                    {getStatusIcon(campaign.status || 'active')}
                                    {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : 'Active'}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(campaign.createdAt || campaign.created_at)}
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-900 font-medium leading-relaxed line-clamp-4">
                                    {campaign.message.slice(0, 150)}
                                    {campaign.message.length > 150 && '...'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Filter className="h-4 w-4" />
                                    <span>{campaign.rules.length} rules</span>
                                </div>
                                <button
                                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium group-hover:gap-2 transition-all duration-200"
                                    onClick={() => fetchLogs(campaign._id)}
                                >
                                    View Logs
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Log Viewer */}
                {logsLoading && (
                    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading campaign logs...</p>
                    </div>
                )}

                {selectedCampaignLogs && (
                    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Eye className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">📊 Delivery Summary</h2>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Message</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white">
                                {selectedCampaignLogs.map((log, index) => (
                                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{log.customer_email}</td>
                                        <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    log.status === 'SENT'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {log.status}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{log.message}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}