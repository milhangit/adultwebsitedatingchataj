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
    const [chatLogs, setChatLogs] = useState<any[]>([]);

    const handleLogout = () => {
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, reportsRes, statsRes, chatRes] = await Promise.all([
                fetch('/api/admin/users?status=all'),
                fetch('/api/admin/reports'),
                fetch('/api/admin/stats'),
                fetch('/api/admin/chat')
            ]);

            if (usersRes.ok) setPendingUsers(await usersRes.json());
            if (reportsRes.ok) setReports(await reportsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (chatRes.ok) setChatLogs(await chatRes.json());
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

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({
        name: '', age: 25, gender: 'Woman', location: 'Colombo', occupation: '', height: "5' 5\"", education: '', imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', religion: 'Buddhist', caste: 'Govigama', bio: '', family: '', preferences: '', email: ''
    });

    const handleCreateUser = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', profile: newUser })
            });
            if (res.ok) {
                setShowCreateModal(false);
                fetchData();
                // Reset form
                setNewUser({
                    name: '', age: 25, gender: 'Woman', location: 'Colombo', occupation: '', height: "5' 5\"", education: '', imageUrl: 'https://randomuser.me/api/portraits/women/' + Math.floor(Math.random() * 99) + '.jpg', religion: 'Buddhist', caste: 'Govigama', bio: '', family: '', preferences: '', email: ''
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedUser.id, updates: selectedUser })
            });
            if (res.ok) {
                setShowEditModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
            {/* Modals */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create AI User</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="p-2 border rounded" />
                            <input type="number" placeholder="Age" value={newUser.age} onChange={e => setNewUser({ ...newUser, age: parseInt(e.target.value) })} className="p-2 border rounded" />
                            <select value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })} className="p-2 border rounded">
                                <option value="Woman">Woman</option>
                                <option value="Man">Man</option>
                            </select>
                            <input type="text" placeholder="Location" value={newUser.location} onChange={e => setNewUser({ ...newUser, location: e.target.value })} className="p-2 border rounded" />
                            <input type="text" placeholder="Occupation" value={newUser.occupation} onChange={e => setNewUser({ ...newUser, occupation: e.target.value })} className="p-2 border rounded" />
                            <input type="text" placeholder="Image URL (randomuser.me)" value={newUser.imageUrl} onChange={e => setNewUser({ ...newUser, imageUrl: e.target.value })} className="p-2 border rounded" />
                            <textarea placeholder="Bio" value={newUser.bio} onChange={e => setNewUser({ ...newUser, bio: e.target.value })} className="p-2 border rounded col-span-2" />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleCreateUser} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Create User</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 flex justify-center mb-4">
                                <img src={selectedUser.imageUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                            </div>
                            <input type="text" placeholder="Name" value={selectedUser.name} onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} className="p-2 border rounded" />
                            <input type="text" placeholder="Image URL" value={selectedUser.imageUrl} onChange={e => setSelectedUser({ ...selectedUser, imageUrl: e.target.value })} className="p-2 border rounded" />
                            <input type="text" placeholder="Occupation" value={selectedUser.occupation} onChange={e => setSelectedUser({ ...selectedUser, occupation: e.target.value })} className="p-2 border rounded" />
                            <textarea placeholder="Bio" value={selectedUser.bio} onChange={e => setSelectedUser({ ...selectedUser, bio: e.target.value })} className="p-2 border rounded col-span-2" />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleUpdateUser} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

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
                        onClick={() => setActiveTab('online')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'online' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        Online Users
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
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                        >
                                            <Users className="w-4 h-4" />
                                            Create AI User
                                        </button>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* All Users List */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-semibold text-gray-900">All Users</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">User</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium">Joined</th>
                                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {pendingUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                                            <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-xs text-gray-500">{user.email || 'No Email'}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {user.isVerified ? 'Verified' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-right space-x-2">
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                                                title="Edit"
                                                            >
                                                                <FileText className="w-5 h-5" />
                                                            </button>
                                                            {!user.isVerified && (
                                                                <button
                                                                    onClick={() => handleUserAction(user.id, 'approve')}
                                                                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                                                                    title="Approve"
                                                                >
                                                                    <Check className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'reject')}
                                                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                                                title="Delete"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
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
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-semibold text-gray-900">Live Message Log</h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {chatLogs.map((log) => (
                                            <div key={log.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm text-gray-900">
                                                        {log.is_user_message ? 'User' : 'AI'}
                                                        <span className="text-gray-400 mx-2">to</span>
                                                        {log.profile_name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm">{log.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'online' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Users</h2>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="font-semibold text-gray-900">Active Now</h3>
                                    </div>
                                    <div className="p-6 text-center text-gray-500">
                                        Feature coming soon: Real-time online status tracking.
                                    </div>
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
