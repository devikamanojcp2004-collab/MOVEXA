import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { MapPin, Calendar, Users, ArrowLeft, Music2, ExternalLink } from 'lucide-react';

const DancerPage = () => {
    const { dancerId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/users/${dancerId}`)
            .then(({ data }) => {
                if (data.user.role !== 'dancer') setError('This user is not a dancer.');
                else setData(data);
            })
            .catch(() => setError('Dancer not found.'))
            .finally(() => setLoading(false));
    }, [dancerId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">🎭</div>
            <p className="text-xl font-bold text-gray-700">{error}</p>
            <Link to="/workshops" className="text-maroon-600 font-semibold hover:underline">Browse Workshops</Link>
        </div>
    );

    const { user, workshops } = data;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-black via-gray-950 to-maroon-950 pt-12 pb-32">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/workshops" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Workshops
                    </Link>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-maroon-700 border-2 border-maroon-500 flex items-center justify-center text-4xl font-black text-white overflow-hidden shadow-xl">
                            {user.avatar
                                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-grow">
                            <span className="inline-block bg-maroon-700/60 text-maroon-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
                                <Music2 className="w-3 h-3 inline mr-1" />Instructor
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{user.name}</h1>
                            {user.bio && <p className="text-gray-300 mt-2 max-w-xl">{user.bio}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-3xl font-black text-white">{workshops.length}</p>
                            <p className="text-gray-400 text-sm">Workshops</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workshops List */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 pb-16">
                <h2 className="text-xl font-bold text-white mb-6">All Workshops by {user.name}</h2>
                {workshops.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-4">🎭</div>
                        <p className="text-gray-400">No approved workshops yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workshops.map(w => (
                            <Link key={w._id} to={`/workshops/${w._id}`}
                                className="group flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-maroon-200 transition-all">
                                <img src={w.image} alt={w.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">{w.title}</h3>
                                        <span className="text-xl font-extrabold text-maroon-700 shrink-0">₹{w.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-maroon-600 font-medium mt-0.5">{w.style} · {w.level}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(w.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {w.time}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{w.location}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{w.capacity - (w.bookingsCount || 0)} spots left</span>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-maroon-500 shrink-0 mt-1 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DancerPage;
