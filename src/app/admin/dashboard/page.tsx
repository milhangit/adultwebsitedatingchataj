'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, BarChart, LogOut, Check, X, Search, AlertTriangle, Trash2, Ban, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/api';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({ totalUsers: 0, totalProfiles: 0, liveUsers: 0, activeMatches: 0, revenue: 0 });
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatLogs, setChatLogs] = useState<any[]>([]);
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
    const [adStats, setAdStats] = useState<any>({});
    const [settings, setSettings] = useState<any>({});
    const [savingSettings, setSavingSettings] = useState(false);

    const handleLogout = () => {
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, reportsRes, statsRes, chatRes, guestsRes, adStatsRes, settingsRes] = await Promise.all([
                apiFetch('/api/admin/users?status=all'),
                apiFetch('/api/admin/reports'),
                apiFetch('/api/admin/stats'),
                apiFetch('/api/admin/chat'),
                apiFetch('/api/admin/guests'),
                apiFetch('/api/admin/adsterra'),
                apiFetch('/api/admin/settings')
            ]);

            if (usersRes.ok) setPendingUsers(await usersRes.json());
            if (reportsRes.ok) setReports(await reportsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (chatRes.ok) setChatLogs(await chatRes.json());
            if (guestsRes.ok) setRegisteredUsers(await guestsRes.json());
            if (adStatsRes.ok) setAdStats(await adStatsRes.json());
            if (settingsRes.ok) setSettings(await settingsRes.json());
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            // Simple client-side check for now (replaced by middleware in real app)
            // In a real app, apiFetch would handle 401s
            fetchData();
        };
        checkAuth();
    }, []);

    const handleUserAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const res = await apiFetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });
            if (res.ok) {
                fetchData(); // Refresh list
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleToggleOnline = async (id: number, currentStatus: boolean) => {
        try {
            const res = await apiFetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggle_online', id, is_online: !currentStatus })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error toggling online status:', error);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({
        name: '', age: 25, gender: 'Woman', location: 'Colombo', occupation: '', height: "5' 5\"", education: '', imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', religion: 'Buddhist', caste: 'Govigama', bio: '', family: '', preferences: '', email: ''
    });

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await apiFetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json() as any;
                if (isEdit) {
                    setSelectedUser({ ...selectedUser, imageUrl: data.url });
                } else {
                    setNewUser({ ...newUser, imageUrl: data.url });
                }
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleCreateUser = async () => {
        try {
            const res = await apiFetch('/api/admin/users', {
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
            const res = await apiFetch('/api/admin/users', {
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
                            <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <input type="number" placeholder="Age" value={newUser.age} onChange={e => setNewUser({ ...newUser, age: parseInt(e.target.value) })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <select value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 bg-white">
                                <option value="Woman">Woman</option>
                                <option value="Man">Man</option>
                            </select>
                            <input type="text" placeholder="Location" value={newUser.location} onChange={e => setNewUser({ ...newUser, location: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <input type="text" placeholder="Occupation" value={newUser.occupation} onChange={e => setNewUser({ ...newUser, occupation: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        placeholder="Image URL (or upload below)"
                                        value={newUser.imageUrl}
                                        onChange={e => setNewUser({ ...newUser, imageUrl: e.target.value })}
                                        className="flex-1 p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400"
                                    />
                                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors">
                                        {uploading ? 'Uploading...' : 'Upload Photo'}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} disabled={uploading} />
                                    </label>
                                </div>
                                {newUser.imageUrl && <img src={newUser.imageUrl} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />}
                            </div>

                            <textarea placeholder="Bio" value={newUser.bio} onChange={e => setNewUser({ ...newUser, bio: e.target.value })} className="p-2 border border-gray-300 rounded col-span-2 text-gray-900 placeholder-gray-400" />
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
                            <div className="col-span-2 flex flex-col items-center mb-4">
                                <img src={selectedUser.imageUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary mb-2" />
                                <label className="cursor-pointer text-primary hover:text-primary-dark text-sm font-medium">
                                    {uploading ? 'Uploading...' : 'Change Photo'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} disabled={uploading} />
                                </label>
                            </div>
                            <input type="text" placeholder="Name" value={selectedUser.name} onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <input type="text" placeholder="Image URL" value={selectedUser.imageUrl} onChange={e => setSelectedUser({ ...selectedUser, imageUrl: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <input type="text" placeholder="Occupation" value={selectedUser.occupation} onChange={e => setSelectedUser({ ...selectedUser, occupation: e.target.value })} className="p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400" />
                            <textarea placeholder="Bio" value={selectedUser.bio} onChange={e => setSelectedUser({ ...selectedUser, bio: e.target.value })} className="p-2 border border-gray-300 rounded col-span-2 text-gray-900 placeholder-gray-400" />
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
                    <h1 className="text-xl font-bold text-primary">MatchLK Admin</h1>
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
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'online' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span className="relative flex h-3 w-3 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-medium">Online Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('registered')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'registered' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Registered Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('monetization')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'monetization' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">Monetization</span>
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

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">Real Users</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">AI Profiles</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.totalProfiles}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                                            <div className="p-3 bg-green-100 text-green-600 rounded-lg relative">
                                                <Users className="w-6 h-6" />
                                                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">Live Now</p>
                                                <p className="text-2xl font-bold text-gray-900">{stats.liveUsers}</p>
                                                <p className="text-xs text-green-600 font-medium">Active (5m)</p>
                                            </div>
                                        </div>
                                    </div>
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
                                                    <th className="px-6 py-3 font-medium">Mobile</th>
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
                                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                                            {user.mobile_number || '-'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-2">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleToggleOnline(user.id, user.is_online)}
                                                                    className={`px-2 py-1 rounded-full text-xs font-medium w-fit border ${user.is_online ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                                                >
                                                                    {user.is_online ? '● Online' : '○ Offline'}
                                                                </button>
                                                            </div>
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
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Content & Settings CMS</h2>
                                    <button
                                        onClick={async () => {
                                            setSavingSettings(true);
                                            try {
                                                const res = await apiFetch('/api/admin/settings', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(settings)
                                                });
                                                if (res.ok) alert('Settings saved successfully!');
                                            } catch (e) {
                                                console.error(e);
                                            } finally {
                                                setSavingSettings(false);
                                            }
                                        }}
                                        disabled={savingSettings}
                                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        {savingSettings ? 'Saving...' : 'Save Site Settings'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            General Information
                                        </h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                            <input
                                                type="text"
                                                value={settings.site_name || ''}
                                                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Title</label>
                                            <input
                                                type="text"
                                                value={settings.welcome_title || ''}
                                                onChange={e => setSettings({ ...settings, welcome_title: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Subtitle</label>
                                            <textarea
                                                rows={3}
                                                value={settings.welcome_subtitle || ''}
                                                onChange={e => setSettings({ ...settings, welcome_subtitle: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <BarChart className="w-5 h-5 text-primary" />
                                            Visuals & Hero
                                        </h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={settings.hero_image || ''}
                                                    onChange={e => setSettings({ ...settings, hero_image: e.target.value })}
                                                    className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
                                                />
                                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs font-bold border border-gray-300 transition-colors">
                                                    Upload
                                                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        const res = await apiFetch('/api/upload', { method: 'POST', body: formData });
                                                        if (res.ok) {
                                                            const data = await res.json() as any;
                                                            setSettings({ ...settings, hero_image: data.url });
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                            {settings.hero_image && (
                                                <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

                        {activeTab === 'registered' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Users Listing</h2>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium">
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Phone</th>
                                                    <th className="px-6 py-4">IP Address</th>
                                                    <th className="px-6 py-4">Location</th>
                                                    <th className="px-6 py-4">Device</th>
                                                    <th className="px-6 py-4">Registered</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {registeredUsers.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No registered users found.</td>
                                                    </tr>
                                                ) : (
                                                    registeredUsers.map((user: any) => (
                                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {user.image_url ? (
                                                                        <img src={user.image_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                                            <Users className="w-5 h-5" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{user.name || 'Anonymous'}</p>
                                                                        <p className="text-xs text-gray-400">ID: {user.user_id?.substring(0, 8)}...</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
                                                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{user.ip_address || 'Unknown'}</td>
                                                            <td className="px-6 py-4 text-gray-600">
                                                                {user.city && user.country ? `${user.city}, ${user.country}` : (user.country || 'Unknown')}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.device_type === 'Mobile' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                                    {user.device_type || 'Desktop'}
                                                                </span>
                                                                <div className="text-[10px] text-gray-400 mt-1 max-w-[150px] truncate" title={user.user_agent}>
                                                                    {user.user_agent}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                                {new Date(user.created_at).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'monetization' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    Adsterra Monetization
                                    <div className="flex items-center gap-4 ml-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Enable All Ads:</span>
                                            <button
                                                onClick={() => setSettings({ ...settings, enable_ads: settings.enable_ads === '1' ? '0' : '1' })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.enable_ads === '1' ? 'bg-primary' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enable_ads === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        {/* @ts-ignore */}
                                        {adStats._is_mock && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-normal border border-yellow-200">
                                                Mock Data (API Connecting...)
                                            </span>
                                        )}
                                    </div>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <span className="text-green-600 text-xl font-bold">$</span>
                                            </div>
                                        </div>
                                        {/* @ts-ignore */}
                                        <p className="text-3xl font-bold text-gray-900">${adStats.totals?.revenue || '0.00'}</p>
                                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                            Last 30 Days
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        {/* @ts-ignore */}
                                        <p className="text-3xl font-bold text-gray-900">{adStats.totals?.impressions?.toLocaleString() || '0'}</p>
                                        <p className="text-sm text-gray-500 mt-2">Ad Views</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <span className="text-purple-600 font-bold">🖱️</span>
                                            </div>
                                        </div>
                                        {/* @ts-ignore */}
                                        <p className="text-3xl font-bold text-gray-900">{adStats.totals?.clicks?.toLocaleString() || '0'}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {/* @ts-ignore */}
                                            CTR: {adStats.totals?.ctr || '0'}%
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500">eCPM</h3>
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <span className="text-orange-600 font-bold">M</span>
                                            </div>
                                        </div>
                                        {/* @ts-ignore */}
                                        <p className="text-3xl font-bold text-gray-900">${adStats.totals?.cpm || '0.00'}</p>
                                        <p className="text-sm text-gray-500 mt-2">Avg. Cost Per Mille</p>
                                    </div>
                                </div>

                                {/* Daily Revenue Breakdown */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                            Daily Revenue Breakdown (Last 30 Days)
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                                                <tr>
                                                    <th className="px-6 py-3">Date</th>
                                                    <th className="px-6 py-3">Impressions</th>
                                                    <th className="px-6 py-3">Clicks</th>
                                                    <th className="px-6 py-3">Revenue</th>
                                                    <th className="px-6 py-3">CPM</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {/* @ts-ignore */}
                                                {!adStats.items || adStats.items.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">No data available for this period.</td>
                                                    </tr>
                                                ) : (
                                                    /* @ts-ignore */
                                                    adStats.items.map((item: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 font-medium text-gray-900">{item.date}</td>
                                                            <td className="px-6 py-4 text-gray-600">{Number(item.impressions).toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-gray-600">{Number(item.clicks).toLocaleString()}</td>
                                                            <td className="px-6 py-4 font-bold text-green-600">${Number(item.revenue).toFixed(2)}</td>
                                                            <td className="px-6 py-4 text-gray-500">
                                                                ${item.impressions > 0 ? ((item.revenue / item.impressions) * 1000).toFixed(2) : '0.00'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        Active Ad Placements
                                    </h3>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-700">Popunder Script (Global)</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${settings.ad_popunder_script ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {settings.ad_popunder_script ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            placeholder="Paste Popunder Script here..."
                                            value={settings.ad_popunder_script || ''}
                                            onChange={e => setSettings({ ...settings, ad_popunder_script: e.target.value })}
                                            className="w-full p-2 font-mono text-xs bg-white border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-700">Social Bar Script (Global)</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${settings.ad_social_bar_script ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {settings.ad_social_bar_script ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            placeholder="Paste Social Bar Script here..."
                                            value={settings.ad_social_bar_script || ''}
                                            onChange={e => setSettings({ ...settings, ad_social_bar_script: e.target.value })}
                                            className="w-full p-2 font-mono text-xs bg-white border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="block font-bold text-gray-700 mb-2">Banner 320x50</span>
                                            <textarea
                                                rows={3}
                                                placeholder="320x50 Banner Code..."
                                                value={settings.ad_banner_320_50 || ''}
                                                onChange={e => setSettings({ ...settings, ad_banner_320_50: e.target.value })}
                                                className="w-full p-2 font-mono text-xs bg-white border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="block font-bold text-gray-700 mb-2">Banner 468x60</span>
                                            <textarea
                                                rows={3}
                                                placeholder="468x60 Banner Code..."
                                                value={settings.ad_banner_468_60 || ''}
                                                onChange={e => setSettings({ ...settings, ad_banner_468_60: e.target.value })}
                                                className="w-full p-2 font-mono text-xs bg-white border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-700">Legacy Native In-Feed Ad</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${settings.ad_native_inline ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {settings.ad_native_inline ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            placeholder="Paste Native Script..."
                                            value={settings.ad_native_inline || ''}
                                            onChange={e => setSettings({ ...settings, ad_native_inline: e.target.value })}
                                            className="w-full p-2 font-mono text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <button
                                        onClick={async () => {
                                            setSavingSettings(true);
                                            try {
                                                const res = await apiFetch('/api/admin/settings', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(settings)
                                                });
                                                if (res.ok) alert('All ad placements updated!');
                                            } catch (e) { console.error(e); }
                                            finally { setSavingSettings(false); }
                                        }}
                                        disabled={savingSettings}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all"
                                    >
                                        {savingSettings ? 'Saving...' : 'Save All Ad Configurations'}
                                    </button>
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
