import { useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Clock, Users, CheckCircle, XCircle, AlertCircle, Calendar, MapPin } from 'lucide-react';

const STYLES = ['Hip Hop', 'Ballet', 'Contemporary', 'Salsa', 'Bollywood', 'Kathak', 'Jazz', 'Freestyle', 'Popping & Locking', 'Bharatanatyam', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const StatusBadge = ({ status }) => {
    // Optionally keep for older workshops, but no longer used in UI directly
    const map = { pending: ['bg-yellow-100 text-yellow-700', <AlertCircle className="w-3 h-3" />], approved: ['bg-green-100 text-green-700', <CheckCircle className="w-3 h-3" />], rejected: ['bg-red-100 text-red-700', <XCircle className="w-3 h-3" />] };
    const [cls, icon] = map[status] || ['bg-gray-100 text-gray-600', null];
    return null; // completely hide it based on new requirements
};

// Returns the minimum selectable date (today if current time allows a 24h gap, else tomorrow)
const getMinDate = () => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
};

const WorkshopForm = ({ initial, onSave, onCancel }) => {
    // Parse initial time if editing (e.g. "02:30 PM" or "14:30")
    let initHour = '06', initMin = '00', initAmpm = 'PM';
    if (initial?.time) {
        // Simple extraction for either 12h or 24h format found in old DB entries
        const match = initial.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
            let h = parseInt(match[1], 10);
            initMin = match[2];
            initAmpm = match[3]?.toUpperCase() || (h >= 12 ? 'PM' : 'AM');
            if (h > 12) h -= 12;
            if (h === 0) h = 12;
            initHour = h.toString().padStart(2, '0');
        }
    }

    const [form, setForm] = useState(initial || { title: '', description: '', style: 'Hip Hop', date: '', time: '', duration: '2 hours', location: '', price: '', capacity: '', image: '', level: 'All Levels' });
    const [timeParts, setTimeParts] = useState({ hour: initHour, min: initMin, ampm: initAmpm });
    const [saving, setSaving] = useState(false);
    const [dateError, setDateError] = useState('');
    
    const set = (k, v) => { setDateError(''); setForm(p => ({ ...p, [k]: v })); };
    const setTime = (k, v) => { setDateError(''); setTimeParts(p => ({ ...p, [k]: v })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert selected AM/PM to 24h format for consistent validation/backend sorting (optional but good practice)
        // or just send as AM/PM string. Let's send as "02:30 PM" format
        const formattedTime = `${timeParts.hour}:${timeParts.min} ${timeParts.ampm}`;
        
        if (form.date) {
            // Need a valid 24h string to parse with Date
            let h24 = parseInt(timeParts.hour, 10);
            if (timeParts.ampm === 'PM' && h24 !== 12) h24 += 12;
            if (timeParts.ampm === 'AM' && h24 === 12) h24 = 0;
            const h24Str = h24.toString().padStart(2, '0');
            
            const dateTimeStr = `${form.date}T${h24Str}:${timeParts.min}:00`;
            const selected = new Date(dateTimeStr);
            const minAllowed = new Date(Date.now() + 24 * 60 * 60 * 1000);
            if (selected < minAllowed) {
                setDateError('Workshop must be scheduled at least 24 hours from now.');
                return;
            }
        }
        setDateError('');
        setSaving(true);
        try { await onSave({ ...form, time: formattedTime }); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{initial ? 'Edit Workshop' : 'Create New Workshop'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Workshop Title *</label>
                    <input required value={form.title} onChange={e => set('title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" placeholder="e.g. Advanced Bollywood Workshop" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
                    <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 resize-none" placeholder="Describe what students will learn..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Dance Style *</label>
                    <select required value={form.style} onChange={e => set('style', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 bg-white">
                        {STYLES.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Level</label>
                    <select value={form.level} onChange={e => set('level', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 bg-white">
                        {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date *</label>
                    <input required type="date" min={getMinDate()} value={form.date?.split('T')[0] || ''} onChange={e => set('date', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Time *</label>
                    <div className="flex gap-2">
                        <select required value={timeParts.hour} onChange={e => setTime('hour', e.target.value)} className="w-full px-2 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 bg-white">
                            {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span className="flex items-center text-gray-500">:</span>
                        <select required value={timeParts.min} onChange={e => setTime('min', e.target.value)} className="w-full px-2 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 bg-white">
                            {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select required value={timeParts.ampm} onChange={e => setTime('ampm', e.target.value)} className="w-full px-2 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 bg-white">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                {dateError && (
                    <div className="sm:col-span-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                        <span>⚠️</span> {dateError}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                    <input value={form.duration} onChange={e => set('duration', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" placeholder="e.g. 2 hours" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location *</label>
                    <input required value={form.location} onChange={e => set('location', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" placeholder="City, State" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹) *</label>
                    <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" placeholder="1200" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Capacity *</label>
                    <input required type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" placeholder="20" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cover Image URL</label>
                    <input value={form.image} onChange={e => set('image', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400" placeholder="https://..." />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-maroon-700 hover:bg-maroon-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60">
                    {saving ? 'Saving...' : initial ? 'Update Workshop' : 'Submit for Review'}
                </button>
                {onCancel && <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>}
            </div>
        </form>
    );
};

const DancerDashboard = ({ defaultTab }) => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState(defaultTab || 'workshops');
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadWorkshops = async () => {
            try {
                const { data } = await api.get('/workshops/dancer/my');
                setWorkshops(data);
            } catch { toast.error('Failed to load workshops'); }
            finally { setLoading(false); }
        };
        loadWorkshops();
    }, []);

    const handleCreate = async (form) => {
        try {
            const { data } = await api.post('/workshops', form);
            setWorkshops(p => [data, ...p]);
            toast.success('Workshop submitted for review!');
            setTab('workshops');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to create'); }
    };

    const handleUpdate = async (form) => {
        try {
            const { data } = await api.put(`/workshops/${editing._id}`, form);
            setWorkshops(p => p.map(w => w._id === editing._id ? data : w));
            setEditing(null);
            toast.success('Workshop updated!');
            setTab('workshops');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this workshop? All bookings will be cancelled.')) return;
        try {
            await api.delete(`/workshops/${id}`);
            setWorkshops(p => p.filter(w => w._id !== id));
            toast.success('Workshop deleted');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    };

    const saveProfile = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const { data } = await api.put('/auth/profile', profileForm);
            updateUser(data.user || data); toast.success('Profile updated!');
        } catch { toast.error('Failed to update'); } finally { setSaving(false); }
    };

    const tabs = [['workshops', 'My Workshops'], ['create', 'Post Workshop'], ['profile', 'Profile']];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Pending Approval Banner – blocks full dashboard */}
                {user?.isApproved === false ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-5xl">
                            ⏳
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Account Pending Approval</h2>
                        <p className="text-gray-500 max-w-md mb-6">
                            Your dancer account is under review. An admin will approve your account shortly.
                            Once approved, you'll have full access to post and manage workshops.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 max-w-sm w-full text-left">
                            <p className="text-sm font-semibold text-yellow-800 mb-1">While you wait, you can:</p>
                            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                                <li>Complete your profile</li>
                                <li>Browse workshops as a learner</li>
                                <li>Contact support if urgent</li>
                            </ul>
                        </div>
                        <a href="/profile" className="mt-6 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                            Complete Your Profile
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-black to-maroon-950 rounded-2xl p-8 mb-8 flex items-center gap-6 text-white shadow-xl">

                            <div className="w-16 h-16 rounded-full bg-maroon-700 flex items-center justify-center text-2xl font-bold border-2 border-maroon-400 overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold">{user?.name}</h1>
                                <p className="text-gray-300 text-sm">{user?.email}</p>
                                <span className="inline-block mt-1 bg-maroon-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">💃 Dancer</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                            {tabs.map(([key, label]) => (
                                <button key={key} onClick={() => { setTab(key); setEditing(null); }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-maroon-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* My Workshops */}
                        {tab === 'workshops' && !editing && (
                            <div>
                                {loading ? <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse"></div>)}</div>
                                    : workshops.length === 0 ? (
                                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                            <div className="text-5xl mb-4">🎭</div>
                                            <h3 className="text-xl font-bold text-gray-700">No workshops yet</h3>
                                            <p className="text-gray-400 text-sm mt-1 mb-4">Share your passion by posting your first workshop!</p>
                                            <button onClick={() => setTab('create')} className="bg-maroon-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-maroon-600 transition-colors">
                                                <Plus className="w-4 h-4 inline mr-1" />Post a Workshop
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {workshops.map(w => (
                                                <div key={w._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start">
                                                    <img src={w.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-bold text-gray-900 truncate">{w.title}</h3>
                                                        </div>
                                                        <p className="text-sm text-maroon-600 font-medium mt-0.5">{w.style} · {w.level}</p>
                                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {w.time}</span>
                                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</span>
                                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{w.bookingsCount || 0}/{w.capacity} booked</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => { setEditing(w); setTab('edit'); }} className="p-2 text-maroon-600 hover:bg-maroon-50 rounded-xl transition-colors"><Edit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(w._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        )}

                        {/* Create */}
                        {tab === 'create' && <WorkshopForm onSave={handleCreate} onCancel={() => setTab('workshops')} />}

                        {/* Edit */}
                        {(tab === 'edit' || editing) && editing && (
                            <WorkshopForm initial={editing} onSave={handleUpdate} onCancel={() => { setEditing(null); setTab('workshops'); }} />
                        )}

                        {/* Profile */}
                        {tab === 'profile' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                                <form onSubmit={saveProfile} className="space-y-4">
                                    {[['name', 'Full Name', 'text', 'Your name'], ['bio', 'Bio / About You', 'textarea', 'Tell students about your dance journey...'], ['avatar', 'Avatar URL', 'text', 'https://...']].map(([field, label, type, ph]) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                                            {type === 'textarea' ? (
                                                <textarea value={profileForm[field]} onChange={e => setProfileForm(p => ({ ...p, [field]: e.target.value }))} rows={3} placeholder={ph}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 resize-none" />
                                            ) : (
                                                <input type={type} value={profileForm[field]} onChange={e => setProfileForm(p => ({ ...p, [field]: e.target.value }))} placeholder={ph}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" />
                                            )}
                                        </div>
                                    ))}
                                    <button type="submit" disabled={saving} className="bg-maroon-700 hover:bg-maroon-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DancerDashboard;

