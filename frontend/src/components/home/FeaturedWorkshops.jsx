import { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeaturedWorkshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/workshops?limit=3');
                setWorkshops(data.workshops || []);
            } catch { setWorkshops([]); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    return (
        <section className="py-24 bg-white" id="workshops">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-maroon-50 border border-maroon-100 text-maroon-700 text-sm font-semibold mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-maroon-600"></span>
                            Featured Sessions
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            Trending <span className="text-maroon-700">Workshops</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Level up your skills with exclusive sessions taught by world-renowned choreographers.
                        </p>
                    </div>
                    <Link to="/workshops" className="inline-flex items-center gap-2 text-maroon-700 font-semibold hover:text-maroon-800 transition-colors group">
                        View all classes
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>)}
                    </div>
                ) : workshops.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No workshops available yet. <Link to="/register" className="text-maroon-600 font-semibold">Be the first to post one!</Link></p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workshops.map((workshop) => (
                            <Link key={workshop._id} to={`/workshops/${workshop._id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-maroon-700/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">{workshop.style}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                        <img src={workshop.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(workshop.instructor?.name || 'I')}&background=800000&color=fff&size=60`}
                                            alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                                        <span className="text-white text-xs font-medium">{workshop.instructor?.name}</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-maroon-700 transition-colors mb-1">{workshop.title}</h3>
                                    <p className="text-sm text-gray-400 font-medium mb-3">{workshop.level}</p>
                                    <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-maroon-400" /><span>{new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {workshop.time}</span></div>
                                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-maroon-400" /><span className="truncate">{workshop.location}</span></div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xl font-extrabold text-maroon-700">₹{workshop.price.toLocaleString()}</span>
                                        <span className="text-xs font-semibold text-maroon-600 bg-maroon-50 px-3 py-1 rounded-full">Book Now →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedWorkshops;
