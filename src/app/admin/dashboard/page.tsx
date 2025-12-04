'use client';

import { useState } from 'react';
import { Users, FileText, MessageSquare, BarChart, LogOut, Check, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');

    const handleLogout = () => {
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/admin/login');
    };

    // Mock Data
    const pendingUsers = [
        { id: 101, name: 'Kamal Perera', email: 'kamal@example.com', status: 'Pending', date: '2023-10-25' },
        { id: 102, name: 'Nimali Silva', email: 'nimali@example.com', status: 'Pending', date: '2023-10-26' },
    ];

    const reports = [
        { id: 1, reporter: 'User A', reported: 'User B', reason: 'Inappropriate language', status: 'Open' },
    ];

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
                                        {pendingUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 text-gray-500">{user.date}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-5 h-5" /></button>
                                                    <button className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
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
                                <p className="text-3xl font-bold text-gray-900 mt-2">1,245</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-gray-500 text-sm font-medium">Active Matches</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">328</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-gray-500 text-sm font-medium">Revenue (Monthly)</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">$4,500</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
