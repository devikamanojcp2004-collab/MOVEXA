import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, Star } from 'lucide-react';

const WorkshopDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get(`/workshops/${id}`);
                setWorkshop(data);
            } catch { toast.error('Workshop not found'); navigate('/workshops'); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    const handleBook = async () => {
        if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
        if (user.role !== 'user') { toast.error('Only learners can book workshops'); return; }
        setBooking(true);
        try {
            await api.post('/bookings', { workshopId: id });
            setBooked(true);
            toast.success('🎉 Workshop booked successfully!');
            setWorkshop(p => ({ ...p, bookingsCount: (p.bookingsCount || 0) + 1 }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally { setBooking(false); }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!workshop) return null;

    const spotsLeft = workshop.capacity - (workshop.bookingsCount || 0);
    const isFull = spotsLeft <= 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Image */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-maroon-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{workshop.style}</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">{workshop.title}</h1>
                    <p className="text-white/70 mt-1">{workshop.level} Level</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-8">
                    {/* Instructor */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <img
                            src={workshop.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(workshop.instructor?.name || 'I')}&background=800000&color=fff&size=100`}
                            alt="" className="w-16 h-16 rounded-full object-cover border-2 border-maroon-200" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Instructor</p>
                            <h3 className="text-lg font-bold text-gray-900">{workshop.instructor?.name}</h3>
                            {workshop.instructor?.bio && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{workshop.instructor.bio}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">About this workshop</h2>
                        <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Workshop Details</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { icon: Calendar, label: 'Date', value: new Date(workshop.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                                { icon: Clock, label: 'Time', value: `${workshop.time} · ${workshop.duration}` },
                                { icon: MapPin, label: 'Location', value: workshop.location },
                                { icon: Users, label: 'Capacity', value: `${workshop.capacity} total · ${spotsLeft} spots left` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <div className="bg-maroon-50 p-2 rounded-xl">
                                        <Icon className="w-5 h-5 text-maroon-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                                        <p className="text-gray-800 font-medium">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                        <div className="text-3xl font-extrabold text-maroon-700 mb-1">₹{workshop.price.toLocaleString()}</div>
                        <p className="text-gray-400 text-sm mb-5">per person</p>

                        {isFull ? (
                            <div className="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl text-center">Fully Booked</div>
                        ) : booked ? (
                            <div className="w-full py-3 bg-green-50 text-green-700 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-green-200">
                                <CheckCircle className="w-5 h-5" /> Booked!
                            </div>
                        ) : (
                            <button onClick={handleBook} disabled={booking || !user || user?.role !== 'user'}
                                className="w-full py-3 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-maroon-900/30 disabled:opacity-60 disabled:cursor-not-allowed">
                                {booking ? 'Booking...' : user?.role === 'dancer' ? 'Dancers cannot book' : user?.role === 'admin' ? 'Admins cannot book' : !user ? 'Login to Book' : 'Book Now'}
                            </button>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-maroon-400" /><span>Top-rated instructor</span></div>
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-maroon-400" /><span>{spotsLeft} spots remaining</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetailPage;
