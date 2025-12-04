'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, BarChart, LogOut, Check, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({ totalUsers: 0, activeMatches: 0, revenue: 0 });
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, reportsRes, statsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/reports'),
                fetch('/api/admin/stats')
            ]);

            if (usersRes.ok) setPendingUsers(await usersRes.json());
            if (reportsRes.ok) setReports(await reportsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });
            if (res.ok) {
                // Refresh data
                fetchData();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="bg-white w-full md:w-64 border-r border-gray-200 flex-shrink-0">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-primary">DateSL Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Users className="w-5 h-5" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Content & CMS
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Chat Oversight
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BarChart className="w-5 h-5" />
                        Reports & Analytics
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-200 mt-auto">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 hover:text-red-700 px-4 py-2 text-sm font-medium">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                </div>

                                {/* Pending Approvals */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Name</th>
                                                    <th className="px-6 py-3 font-medium">Email</th>
                                                    <th className="px-6 py-3 font-medium">Date</th>
                                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                                        <td className="px-6 py-4 text-gray-500">{user.email || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-right space-x-2">
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'approve')}
                                                                className="text-green-600 hover:bg-green-50 p-1 rounded"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'reject')}
                                                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                                                title="Reject"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No pending approvals</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-gray-500">CMS features for editing banners and testimonials will go here.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat Oversight</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-gray-500">Logs of flagged chat interactions will appear here.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <h3 className="text-gray-500 text-sm font-medium">Active Matches</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeMatches}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <h3 className="text-gray-500 text-sm font-medium">Revenue (Monthly)</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-semibold text-gray-900">Recent Reports</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Reporter</th>
                                                    <th className="px-6 py-3 font-medium">Reason</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reports.map((report) => (
                                                    <tr key={report.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{report.reporter_name}</td>
                                                        <td className="px-6 py-4 text-gray-500">{report.reason}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                                }`}>
                                                                {report.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">{new Date(report.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
