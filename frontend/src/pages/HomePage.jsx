import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import {
    Calendar, MapPin, ArrowRight, Music2, LayoutDashboard,
    Users, Search, ChevronRight, X, Loader2,
} from 'lucide-react';

// ─── Dance styles (same as WorkshopsPage) ────────────────────────────────────
const STYLES = [
    'Hip Hop', 'Ballet', 'Contemporary', 'Salsa', 'Bollywood',
    'Kathak', 'Jazz', 'Freestyle', 'Popping & Locking', 'Bharatanatyam', 'Other',
];

// ─── Single workshop card ─────────────────────────────────────────────────────
const WorkshopCard = ({ workshop: w }) => (
    <Link
        to={`/workshops/${w._id}`}
        className="group card flex flex-col"
    >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
            <img
                src={w.image}
                alt={w.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(w.title)}&background=800000&color=fff&size=400`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute top-3 left-3 bg-maroon-700 text-white text-xs font-bold px-3 py-1 rounded-full">{w.style}</span>
            {w.level && (
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">{w.level}</span>
            )}
            {/* Instructor avatar */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <img
                    src={w.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.instructor?.name || 'I')}&background=800000&color=fff`}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">{w.instructor?.name}</span>
            </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-maroon-700 transition-colors line-clamp-2 mb-2">{w.title}</h3>
            <div className="space-y-1 text-xs text-gray-500 flex-grow">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-maroon-500 shrink-0" />
                    <span>{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} {w.time && `· ${w.time}`}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-maroon-500 shrink-0" />
                    <span className="truncate">{w.location}</span>
                </div>
                {w.capacity && (
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-maroon-500 shrink-0" />
                        <span>{Math.max(0, w.capacity - (w.bookingsCount || 0))} spots left</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <span className="text-xl font-bold text-maroon-700">₹{w.price?.toLocaleString()}</span>
                <span className="text-maroon-600 font-medium text-xs flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    View details <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    </Link>
);

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="skeleton-shimmer h-48" />
        <div className="p-4 space-y-3">
            <div className="skeleton-shimmer h-5 rounded-md w-3/4" />
            <div className="skeleton-shimmer h-4 rounded-md w-1/2" />
            <div className="skeleton-shimmer h-4 rounded-md w-2/3" />
            <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                <div className="skeleton-shimmer h-6 rounded w-1/4" />
                <div className="skeleton-shimmer h-4 rounded w-1/4 mt-1" />
            </div>
        </div>
    </div>
);

// ─── Role-based quick-action links ───────────────────────────────────────────
const roleLinks = {
    user: [
        { to: '/workshops', icon: Search, label: 'Browse All', desc: 'Full search & filter' },
        { to: '/dashboard/user', icon: Calendar, label: 'My Bookings', desc: 'View upcoming sessions' },
        { to: '/profile', icon: Users, label: 'My Profile', desc: 'Edit your information' },
    ],
    dancer: [
        { to: '/dashboard/dancer', icon: Music2, label: 'My Workshops', desc: 'Manage your listings' },
        { to: '/dashboard/dancer', icon: Calendar, label: 'Post Workshop', desc: 'Share your next session' },
        { to: '/profile', icon: Users, label: 'My Profile', desc: 'Edit your dancer profile' },
    ],
    admin: [
        { to: '/dashboard/admin', icon: LayoutDashboard, label: 'Admin Panel', desc: 'Manage the platform' },
        { to: '/workshops', icon: Search, label: 'All Workshops', desc: 'Browse all workshops' },
        { to: '/profile', icon: Users, label: 'My Profile', desc: 'Edit your profile' },
    ],
};

// ─── Main page ────────────────────────────────────────────────────────────────
const HomePage = () => {
    const { user } = useAuth();

    // workshops state
    const [workshops, setWorkshops] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // filter state
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeStyle, setActiveStyle] = useState('');

    const LIMIT = 9;

    const fetchWorkshops = useCallback(async (pg = 1, append = false) => {
        pg === 1 ? setLoading(true) : setLoadingMore(true);
        try {
            const params = { page: pg, limit: LIMIT };
            if (search) params.search = search;
            if (activeStyle) params.style = activeStyle;
            const { data } = await api.get('/workshops', { params });
            setWorkshops(prev => append ? [...prev, ...(data.workshops || [])] : (data.workshops || []));
            setTotal(data.total || 0);
            setPages(data.pages || 1);
            setPage(pg);
        } catch {
            if (!append) setWorkshops([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search, activeStyle]);

    // Fetch on filter change
    useEffect(() => { fetchWorkshops(1, false); }, [fetchWorkshops]);

    const handleSearch = e => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearch('');
    };

    const selectStyle = (style) => {
        setActiveStyle(prev => prev === style ? '' : style);
    };

    const links = roleLinks[user?.role] || roleLinks.user;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">

            {/* ── Greeting Banner ─────────────────────────────── */}
            <div className="bg-gradient-to-r from-black via-gray-950 to-maroon-950 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-maroon-700 border border-maroon-500 flex items-center justify-center text-2xl font-black overflow-hidden shrink-0">
                            {user?.avatar
                                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                : user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-maroon-300 text-xs font-semibold uppercase tracking-wider">Welcome back</p>
                            <h1 className="text-2xl font-extrabold">{user?.name} 👋</h1>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm max-w-lg">
                        {user?.role === 'dancer'
                            ? 'Ready to inspire? Post a new workshop or check your bookings.'
                            : user?.role === 'admin'
                                ? "Here's your platform overview. Approve workshops and manage users."
                                : 'Discover your next workshop. Keep dancing, keep growing.'}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

                {/* ── Quick Actions ────────────────────────────── */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {links.map(({ to, icon: Icon, label, desc }) => (
                            <Link key={label} to={to}
                                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-maroon-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                <div className="w-11 h-11 bg-maroon-50 group-hover:bg-maroon-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                                    <Icon className="w-5 h-5 text-maroon-700" />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-maroon-700 transition-colors text-sm">{label}</h3>
                                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── All Workshops ─────────────────────────────── */}
                <section>
                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">All Workshops</h2>
                            {!loading && (
                                <p className="text-gray-400 text-sm mt-0.5">
                                    {total} workshop{total !== 1 ? 's' : ''} available
                                </p>
                            )}
                        </div>
                        <Link to="/workshops"
                            className="flex items-center gap-1 text-maroon-700 font-semibold text-sm hover:gap-2 transition-all shrink-0">
                            Full browse <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 mb-5">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search workshops…"
                                className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-maroon-200 transition-all"
                            />
                            {searchInput && (
                                <button type="button" onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <button type="submit"
                            className="bg-maroon-700 hover:bg-maroon-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                            Search
                        </button>
                    </form>

                    {/* Style filter pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveStyle('')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                                ${!activeStyle ? 'bg-maroon-700 text-white border-maroon-700' : 'bg-white text-gray-600 border-gray-200 hover:border-maroon-300'}`}>
                            All Styles
                        </button>
                        {STYLES.map(s => (
                            <button key={s} onClick={() => selectStyle(s)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                                    ${activeStyle === s ? 'bg-maroon-700 text-white border-maroon-700' : 'bg-white text-gray-600 border-gray-200 hover:border-maroon-300'}`}>
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : workshops.length === 0 ? (
                        <div className="bg-white rounded-2xl p-14 text-center border border-gray-100">
                            <div className="text-5xl mb-3">🎭</div>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">No workshops found</h3>
                            <p className="text-gray-400 text-sm">
                                {search || activeStyle ? 'Try different search terms or filters.' : (
                                    user?.role === 'dancer'
                                        ? <><Link to="/dashboard/dancer" className="text-maroon-600 font-semibold">Post the first workshop!</Link></>
                                        : 'Check back soon — new workshops are added regularly.'
                                )}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-slideUp">
                                {workshops.map(w => <WorkshopCard key={w._id} workshop={w} />)}
                            </div>

                            {/* Load more */}
                            {page < pages && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => fetchWorkshops(page + 1, true)}
                                        disabled={loadingMore}
                                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-maroon-400 hover:text-maroon-700 px-7 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60">
                                        {loadingMore
                                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                                            : <>Load more <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
