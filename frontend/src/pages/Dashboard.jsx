import { useEffect, useState } from "react";
import { Plus, Eye, LogOut, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            const decoded = jwtDecode(token);
            setUser({
                name: decoded.name || "User",
                email: decoded.email || "user@example.com",
            });
        } catch (err) {
            console.error("Token invalid or expired");
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navigateToCreateCampaign = () => {
        navigate("/create-campaign");
    };

    const navigateToCampaigns = () => {
        navigate("/campaigns");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">Xeno CRM</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
                    </h2>
                    <p className="text-gray-600">Manage your campaigns and grow your business.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                    <button
                        onClick={navigateToCreateCampaign}
                        className="group p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                <Plus className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Create Campaign</h3>
                                <p className="text-sm text-gray-500">Start a new marketing campaign</p>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    </button>

                    <button
                        onClick={navigateToCampaigns}
                        className="group p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all duration-200 text-left"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">View Campaigns</h3>
                                <p className="text-sm text-gray-500">Manage existing campaigns</p>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
}
