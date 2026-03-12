import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Users, LayoutDashboard, CheckCircle, XCircle, AlertCircle, Trash2, Shield, Music2, Briefcase, Clock, Ban, Unlock } from 'lucide-react';


const StatusBadge = ({ status }) => {
    const map = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const RoleBadge = ({ role }) => {
    const map = { admin: 'bg-maroon-100 text-maroon-800', dancer: 'bg-purple-100 text-purple-700', user: 'bg-blue-100 text-blue-700' };
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${map[role] || 'bg-gray-100 text-gray-600'}`}>{role}</span>;
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`${color} p-3 rounded-xl`}><Icon className="w-6 h-6" /></div>
        <div><p className="text-sm text-gray-400 font-medium">{label}</p><p className="text-2xl font-extrabold text-gray-900">{value}</p></div>
    </div>
);

const AdminDashboard = () => {
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [workshops, setWorkshops] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [dancers, setDancers] = useState([]);
    const [loading, setLoading] = useState(false);


    const load = useCallback(async (t) => {
        setLoading(true);
        try {
            if (t === 'overview') {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } else if (t === 'workshops') {
                const { data } = await api.get('/workshops/admin/all');
                setWorkshops(data);
            } else if (t === 'users') {
                const { data } = await api.get('/admin/users');
                setUsers(data);
            } else if (t === 'bookings') {
                const { data } = await api.get('/bookings/admin/all');
                setBookings(data);
            } else if (t === 'dancers') {
                const { data } = await api.get('/admin/dancers');
                setDancers(data);
            }
        } catch { toast.error('Failed to load data'); }
        finally { setLoading(false); }
    }, []);


    useEffect(() => { load(tab); }, [tab]);

    const updateWorkshopStatus = async (id, status) => {
        try {
            const { data } = await api.patch(`/workshops/${id}/status`, { status });
            setWorkshops(p => p.map(w => w._id === id ? data : w));
            toast.success(`Workshop ${status}!`);
        } catch { toast.error('Failed to update status'); }
    };

    const updateUserRole = async (id, role) => {
        try {
            const { data } = await api.patch(`/admin/users/${id}/role`, { role });
            setUsers(p => p.map(u => u._id === id ? data : u));
            setDancers(p => p.map(d => d._id === id ? data : d));
            toast.success('User role updated!');
        } catch { toast.error('Failed to update role'); }
    };

    const deleteUser = async (id) => {
        if (!confirm('Delete this user and all their data?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(p => p.filter(u => u._id !== id));
            setDancers(p => p.filter(d => d._id !== id));
            toast.success('User deleted');
        } catch { toast.error('Failed to delete user'); }
    };

    const toggleBlockStatus = async (id, currentStatus) => {
        const isBlocked = !currentStatus;
        try {
            const { data } = await api.patch(`/admin/users/${id}/block`, { isBlocked });
            setUsers(p => p.map(u => u._id === id ? { ...u, isBlocked: data.user.isBlocked } : u));
            setDancers(p => p.map(d => d._id === id ? { ...d, isBlocked: data.user.isBlocked } : d));
            toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'}!`);
        } catch { toast.error('Failed to update block status'); }
    };

    const approveDancer = async (id) => {
        try {
            await api.patch(`/admin/dancers/${id}/approve`);
            setDancers(p => p.map(d => d._id === id ? { ...d, isApproved: true } : d));
            setStats(prev => prev ? { ...prev, pendingDancers: Math.max(0, prev.pendingDancers - 1) } : prev);
            toast.success('Dancer approved! They can now access their dashboard.');
        } catch { toast.error('Failed to approve dancer'); }
    };

    const rejectDancer = async (id) => {
        if (!confirm('Reject this dancer application?')) return;
        try {
            await api.delete(`/admin/dancers/${id}/reject`);
            setDancers(p => p.filter(d => d._id !== id));
            setStats(prev => prev ? { ...prev, pendingDancers: Math.max(0, prev.pendingDancers - 1) } : prev);
            toast.success('Dancer application rejected');
        } catch { toast.error('Failed to reject dancer'); }
    };

    const tabs = [['overview', 'Overview'], ['workshops', 'Workshops'], ['users', 'Users'], ['dancers', 'Dancers'], ['bookings', 'Bookings']];


    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-maroon-950 rounded-2xl p-8 mb-8 text-white shadow-xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-maroon-700 rounded-xl flex items-center justify-center">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
                        <p className="text-gray-300 text-sm">Manage the MOVEXA platform</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
                    {tabs.map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap px-3 ${tab === key ? 'bg-maroon-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {loading && <div className="text-center py-10"><div className="w-8 h-8 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>}

                {/* Overview */}
                {!loading && tab === 'overview' && stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard icon={Users} label="Learners" value={stats.totalUsers} color="bg-blue-50 text-blue-600" />
                        <StatCard icon={Music2} label="Dancers" value={stats.totalDancers} color="bg-purple-50 text-purple-600" />
                        <StatCard icon={Clock} label="Pending Dancer Approvals" value={stats.pendingDancers ?? 0} color="bg-yellow-50 text-yellow-600" />
                        <StatCard icon={LayoutDashboard} label="Total Workshops" value={stats.totalWorkshops} color="bg-gray-100 text-gray-600" />
                        <StatCard icon={CheckCircle} label="Active Workshops" value={stats.approvedWorkshops} color="bg-green-50 text-green-600" />
                        <StatCard icon={Briefcase} label="Total Bookings" value={stats.totalBookings} color="bg-maroon-50 text-maroon-600" />
                    </div>
                )}


                {/* Workshops */}
                {!loading && tab === 'workshops' && (
                    <div className="space-y-4">
                        {workshops.length === 0 ? <div className="text-center py-12 text-gray-400">No workshops found.</div>
                            : workshops.map(w => (
                                <div key={w._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start">
                                    <img src={w.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{w.title}</h3>
                                        <p className="text-sm text-gray-400 mt-0.5">by <span className="text-maroon-600 font-medium">{w.instructor?.name}</span> · {w.style}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {w.location} · ₹{w.price}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Dancers */}
                {!loading && tab === 'dancers' && (
                    <div className="space-y-3">
                        {dancers.length === 0
                            ? <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <div className="text-4xl mb-3">✅</div>
                                <p className="text-gray-500 font-medium">No dancers found</p>
                            </div>
                            : dancers.map(d => (
                                <div key={d._id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 ${d.isApproved ? 'border-gray-100' : 'border-yellow-100'}`}>
                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-lg overflow-hidden shrink-0">
                                        {d.avatar ? <img src={d.avatar} alt="" className="w-full h-full object-cover" /> : d.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                                            {d.isBlocked && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-tighter">Blocked</span>}
                                        </div>
                                        <p className="text-xs text-gray-400">{d.email}</p>
                                        {d.bio && <p className="text-xs text-gray-500 mt-0.5 truncate">{d.bio}</p>}
                                        <p className="text-xs text-gray-400 mt-0.5">{!d.isApproved ? 'Applied ' : 'Joined '}{new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${d.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {d.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                    
                                    {!d.isApproved ? (
                                        <>
                                            <button
                                                onClick={() => approveDancer(d._id)}
                                                className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />Approve
                                            </button>
                                            <button
                                                onClick={() => rejectDancer(d._id)}
                                                className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />Reject
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => toggleBlockStatus(d._id, d.isBlocked)} 
                                                className={`p-2 rounded-xl transition-colors shrink-0 ${d.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                                title={d.isBlocked ? 'Unblock Dancer' : 'Block Dancer'}>
                                                {d.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => deleteUser(d._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors shrink-0" title="Delete Dancer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Users */}

                {!loading && tab === 'users' && (
                    <div className="space-y-3">
                        {users.length === 0 ? <div className="text-center py-12 text-gray-400">No users found.</div>
                            : users.map(u => (
                                <div key={u._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-700 font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
                                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                                            {u.isBlocked && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-tighter">Blocked</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    <RoleBadge role={u.role} />
                                    <select value={u.role} onChange={e => updateUserRole(u._id, e.target.value)}
                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-maroon-400 bg-white shrink-0">
                                        <option value="user">user</option>
                                        <option value="dancer">dancer</option>
                                        <option value="admin">admin</option>
                                    </select>
                                    <button onClick={() => toggleBlockStatus(u._id, u.isBlocked)} 
                                        className={`p-2 rounded-xl transition-colors shrink-0 ${u.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                        title={u.isBlocked ? 'Unblock User' : 'Block User'}>
                                        {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => deleteUser(u._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                    </div>
                )}

                {/* Bookings */}
                {!loading && tab === 'bookings' && (
                    <div className="space-y-3">
                        {bookings.length === 0 ? <div className="text-center py-12 text-gray-400">No bookings found.</div>
                            : bookings.map(b => (
                                <div key={b._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{b.workshop?.title}</p>
                                        <p className="text-xs text-gray-400">User: <span className="text-gray-600">{b.user?.name}</span> · Instructor: <span className="text-gray-600">{b.workshop?.instructor?.name}</span></p>
                                        <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize shrink-0 ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
