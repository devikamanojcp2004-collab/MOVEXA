import { useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, X, User, Camera } from 'lucide-react';

const UserDashboard = () => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my');
                setBookings(data);
            } catch { toast.error('Failed to load bookings'); }
            finally { setLoading(false); }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
            toast.success('Booking cancelled');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/auth/profile', profileForm);
            updateUser(data.user || data);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update profile'); }
        finally { setSaving(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-maroon-950 rounded-2xl p-8 mb-8 flex items-center gap-6 text-white shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-maroon-700 flex items-center justify-center text-2xl font-bold border-2 border-maroon-400 overflow-hidden">
                        {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold">{user?.name}</h1>
                        <p className="text-gray-300 text-sm">{user?.email}</p>
                        <span className="inline-block mt-1 bg-maroon-700 text-white text-xs font-bold px-3 py-0.5 rounded-full">Learner</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                    {[['bookings', 'My Bookings'], ['profile', 'Edit Profile']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-maroon-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Bookings Tab */}
                {tab === 'bookings' && (
                    <div>
                        {loading ? (
                            <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse"></div>)}</div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <div className="text-5xl mb-4">🎭</div>
                                <h3 className="text-xl font-bold text-gray-700">No bookings yet</h3>
                                <p className="text-gray-400 mt-1 text-sm">Explore workshops and book your first session!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map(b => (
                                    <div key={b._id} className={`bg-white rounded-2xl p-5 shadow-sm border flex gap-4 items-start ${b.status === 'cancelled' ? 'opacity-60' : ''}`}>
                                        <img src={b.workshop?.image || 'https://placehold.co/80x80'} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-gray-900 truncate">{b.workshop?.title}</h3>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-0.5">by {b.workshop?.instructor?.name}</p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.workshop?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.workshop?.location}</span>
                                            </div>
                                        </div>
                                        {b.status === 'confirmed' && (
                                            <button onClick={() => cancelBooking(b._id)} className="shrink-0 text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {tab === 'profile' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                        <form onSubmit={saveProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                                <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 transition-colors"
                                    placeholder="Your full name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Bio</label>
                                <textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 transition-colors resize-none"
                                    placeholder="Tell us about yourself..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Avatar URL</label>
                                <input value={profileForm.avatar} onChange={e => setProfileForm(p => ({ ...p, avatar: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 transition-colors"
                                    placeholder="https://..." />
                            </div>
                            <button type="submit" disabled={saving}
                                className="bg-maroon-700 hover:bg-maroon-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
