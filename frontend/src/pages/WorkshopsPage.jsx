import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import { Search, MapPin, Filter, Calendar, Users, ChevronRight } from 'lucide-react';

const STYLES = ['Hip Hop', 'Ballet', 'Contemporary', 'Salsa', 'Bollywood', 'Kathak', 'Jazz', 'Freestyle', 'Popping & Locking', 'Bharatanatyam', 'Other'];

const WorkshopCard = ({ workshop }) => (
    <Link to={`/workshops/${workshop._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">
        <div className="relative h-52 overflow-hidden">
            <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute top-3 left-3 bg-maroon-700 text-white text-xs font-bold px-3 py-1 rounded-full">{workshop.style}</span>
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">{workshop.level}</span>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <img src={workshop.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(workshop.instructor?.name || 'Instructor')}&background=800000&color=fff`}
                    alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <span className="text-white text-sm font-medium">{workshop.instructor?.name}</span>
            </div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-maroon-700 transition-colors line-clamp-2 mb-3">{workshop.title}</h3>
            <div className="space-y-1.5 text-sm text-gray-500 flex-grow">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-maroon-500 shrink-0" />
                    <span>{new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {workshop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-maroon-500 shrink-0" />
                    <span className="truncate">{workshop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-maroon-500 shrink-0" />
                    <span>{workshop.capacity - (workshop.bookingsCount || 0)} spots left</span>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <span className="text-2xl font-bold text-maroon-700">₹{workshop.price.toLocaleString()}</span>
                <span className="text-maroon-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View details <ChevronRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    </Link>
);

const WorkshopsPage = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [style, setStyle] = useState('');
    const [location, setLocation] = useState('');

    const fetchWorkshops = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (style) params.style = style;
            if (location) params.location = location;
            const { data } = await api.get('/workshops', { params });
            setWorkshops(data.workshops || []);
        } catch (err) {
            setWorkshops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkshops(); }, []);

    const handleSearch = (e) => { e.preventDefault(); fetchWorkshops(); };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-black via-gray-950 to-maroon-950 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your <span className="text-maroon-400">Perfect Workshop</span></h1>
                    <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">Discover workshops across styles, cities, and skill levels</p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto shadow-2xl">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 text-gray-800 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-maroon-200 transition-all"
                                placeholder="Search dance style or keyword..." />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={location} onChange={e => setLocation(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 text-gray-800 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-maroon-200 transition-all"
                                placeholder="City or location..." />
                        </div>
                        <button type="submit" className="bg-maroon-700 hover:bg-maroon-600 text-white px-8 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 justify-center">
                            <Search className="w-4 h-4" /> Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Style Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => { setStyle(''); setTimeout(fetchWorkshops, 0); }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${!style ? 'bg-maroon-700 text-white border-maroon-700' : 'bg-white text-gray-600 border-gray-200 hover:border-maroon-300'}`}>
                        All Styles
                    </button>
                    {STYLES.map(s => (
                        <button key={s} onClick={() => { setStyle(s); setTimeout(fetchWorkshops, 0); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${style === s ? 'bg-maroon-700 text-white border-maroon-700' : 'bg-white text-gray-600 border-gray-200 hover:border-maroon-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm">
                                <div className="bg-gray-200 h-52 rounded-t-2xl"></div>
                                <div className="p-5 space-y-2">
                                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : workshops.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎭</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No workshops found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 text-sm mb-6">{workshops.length} workshop{workshops.length !== 1 ? 's' : ''} found</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workshops.map(w => <WorkshopCard key={w._id} workshop={w} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkshopsPage;
