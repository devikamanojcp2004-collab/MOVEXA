import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

const UserPage = () => {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/users/${userId}`)
            .then(({ data }) => setData(data))
            .catch(() => setError('User not found.'))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">🤷</div>
            <p className="text-xl font-bold text-gray-700">{error || 'User not found.'}</p>
            <Link to="/" className="text-maroon-600 font-semibold hover:underline">Go Home</Link>
        </div>
    );

    const { user } = data;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="bg-gradient-to-br from-black via-gray-950 to-maroon-950 pt-12 pb-24">
                <div className="max-w-3xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-maroon-700 border-2 border-maroon-500 text-white font-extrabold text-3xl flex items-center justify-center overflow-hidden shadow-xl">
                            {user.avatar
                                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <span className="inline-block bg-maroon-700/50 text-maroon-300 text-xs font-bold px-3 py-1 rounded-full mb-2 capitalize">{user.role}</span>
                            <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
                            {user.bio && <p className="text-gray-300 mt-1 max-w-md text-sm">{user.bio}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {user.role === 'dancer' && data.workshops?.length > 0 && (
                <div className="max-w-3xl mx-auto px-4 -mt-12 pb-16">
                    <h2 className="text-lg font-bold text-white mb-4">Workshops</h2>
                    <div className="space-y-3">
                        {data.workshops.map(w => (
                            <Link key={w._id} to={`/workshops/${w._id}`}
                                className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-maroon-200 transition-all group">
                                <img src={w.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">{w.title}</h3>
                                    <p className="text-sm text-maroon-600 font-medium">{w.style}</p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {user.role !== 'dancer' && (
                <div className="max-w-3xl mx-auto px-4 -mt-12 pb-16">
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-400">This is a learner profile.</p>
                        <Link to="/workshops" className="text-maroon-600 font-semibold hover:underline text-sm mt-2 inline-block">Browse Workshops →</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
