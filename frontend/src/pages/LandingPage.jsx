import { Link } from 'react-router-dom';
import { ArrowRight, Music2, Users, Shield, Star, Calendar, MapPin, Search, Zap, CheckCircle } from 'lucide-react';
import DancerLogo from '../components/common/DancerLogo';

const FEATURES = [
    { icon: Search, title: 'Discover Workshops', desc: 'Browse hundreds of dance workshops across styles — from Bollywood to Contemporary, Hip Hop to Bharatanatyam.' },
    { icon: Music2, title: 'Expert Dancers', desc: 'Every instructor is verified. Learn from passionate professionals who live and breathe their craft.' },
    { icon: Zap, title: 'Instant Booking', desc: 'Find a workshop you love, book your spot in seconds. Simple, fast, hassle-free.' },
];

const STYLES = ['Hip Hop', 'Bollywood', 'Contemporary', 'Salsa', 'Kathak', 'Ballet', 'Jazz', 'Freestyle'];

const TESTIMONIALS = [
    { name: 'Ananya S.', role: 'Learner', text: 'MOVEXA completely changed how I find dance classes. Booked my first Contemporary session in 2 minutes!', avatar: 'A' },
    { name: 'Rahul M.', role: 'Dancer / Instructor', text: 'I went from zero students to 40+ bookings in my first month. The platform is incredible for building your teaching brand.', avatar: 'R' },
    { name: 'Priya K.', role: 'Learner', text: 'The best Bollywood workshop I ever attended. So easy to find and book. Highly recommend!', avatar: 'P' },
];

const LandingPage = () => {
    return (
        <div className="bg-white">
            {/* ─── Hero ───────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-950 to-maroon-950 pt-20">
                {/* Glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none animate-fadeIn">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-maroon-900/40 blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-maroon-800/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left */}
                        <div className="animate-slideUp">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-maroon-300 text-sm font-medium mb-8">
                                <span className="w-2 h-2 rounded-full bg-maroon-400 animate-pulse" />
                                India's Premier Dance Workshop Platform
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
                                Move.{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-maroon-400 to-maroon-300">
                                    Express.
                                </span>
                                <br />Elevate.
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                Discover and book world-class dance workshops. Whether you're a beginner or a pro — your next breakthrough is one class away.
                            </p>
                            <div className="flex flex-wrap gap-4 relative">
                                <Link to="/workshops" className="btn-primary flex items-center gap-2 text-lg relative z-10 group">
                                    Explore Workshops <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="absolute inset-0 bg-maroon-500/20 blur-2xl rounded-full scale-110 pointer-events-none animate-pulse"></div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-maroon-900/30">
                                {[['500+', 'Workshops'], ['200+', 'Instructors'], ['10k+', 'Students']].map(([num, label]) => (
                                    <div key={label}>
                                        <p className="text-3xl font-black text-white">{num}</p>
                                        <p className="text-gray-400 text-sm">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right – floating cards */}
                        <div className="relative hidden lg:block animate-fadeIn">
                            <div className="relative w-full h-[520px]">
                                {/* Main card */}
                                <div className="absolute inset-8 glass-dark rounded-3xl overflow-hidden shadow-2xl animate-float">
                                    <img
                                        src="https://images.unsplash.com/photo-1546548729-47090eda4a0b?q=80&w=800&auto=format&fit=crop"
                                        alt="Dance workshop"
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white max-w-[80%]">
                                        <span className="inline-block bg-maroon-700 text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-lg">Bollywood</span>
                                        <p className="text-xl font-bold leading-tight">Bollywood Beats Masterclass</p>
                                        <p className="text-gray-300 text-sm mt-1 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-maroon-500 inline-block align-middle overflow-hidden">
                                                <img src="https://ui-avatars.com/api/?name=P+S&background=800000&color=fff" alt="" />
                                            </span>
                                            with Priya Sharma
                                        </p>
                                    </div>
                                </div>
                                {/* Floating badge – date */}
                                <div className="absolute top-4 -left-6 glass rounded-2xl p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
                                    <div className="bg-maroon-100 p-2.5 rounded-xl"><Calendar className="w-5 h-5 text-maroon-700" /></div>
                                    <div><p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Next session</p><p className="font-bold text-gray-900">Today, 5:00 PM</p></div>
                                </div>
                                {/* Floating badge – rating */}
                                <div className="absolute bottom-12 -right-4 glass rounded-2xl p-4 animate-float" style={{ animationDelay: '0.7s' }}>
                                    <div className="flex items-center gap-1 text-yellow-500 mb-1">★★★★★</div>
                                    <p className="font-bold text-gray-900 text-sm">"Changed my life!"</p>
                                    <p className="text-xs text-gray-500">— Ananya S.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Dance Styles ──────────────────────────────────────────── */}
            <section className="py-16 bg-gray-50 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-center text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Browse by Style</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {STYLES.map(s => (
                            <Link key={s} to={`/workshops?style=${encodeURIComponent(s)}`}
                                className="px-5 py-2.5 bg-white border border-gray-200 hover:border-maroon-400 hover:bg-maroon-50 hover:text-maroon-700 text-gray-700 rounded-full font-medium transition-all text-sm shadow-sm">
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features ──────────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-maroon-700 uppercase tracking-widest mb-3">Why MOVEXA</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Everything you need to <span className="text-maroon-700">dance</span>
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="group p-8 rounded-2xl border border-gray-100 hover:border-maroon-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-maroon-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-maroon-100 transition-colors">
                                    <Icon className="w-7 h-7 text-maroon-700" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
                                <p className="text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ──────────────────────────────────────────── */}
            <section className="py-24 bg-gray-950 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-maroon-400 uppercase tracking-widest mb-3">Simple Process</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Start dancing in <span className="text-maroon-400">3 steps</span>
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10 relative">
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-maroon-800 via-maroon-600 to-maroon-800" />
                        {[
                            { n: '01', title: 'Create Account', desc: 'Sign up as a learner or a dancer in under a minute.' },
                            { n: '02', title: 'Find Your Workshop', desc: 'Browse, filter by style, location or instructor, and pick your session.' },
                            { n: '03', title: 'Book & Dance', desc: 'Secure your spot instantly. Show up, learn, grow.' },
                        ].map(({ n, title, desc }) => (
                            <div key={n} className="relative z-10 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl bg-maroon-800 border border-maroon-600 flex items-center justify-center text-2xl font-black text-maroon-200 mb-6">{n}</div>
                                <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials ──────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-extrabold text-gray-900">Loved by dancers & learners</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(({ name, role, text, avatar }) => (
                            <div key={name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex text-yellow-400 mb-4">★★★★★</div>
                                <p className="text-gray-700 mb-6 leading-relaxed">"{text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-maroon-700 text-white font-bold flex items-center justify-center">{avatar}</div>
                                    <div><p className="font-bold text-gray-900 text-sm">{name}</p><p className="text-gray-400 text-xs">{role}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ───────────────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-r from-maroon-950 to-black text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Ready to step into the spotlight?
                    </h2>
                    <p className="text-gray-300 text-xl mb-10">
                        Join thousands of dancers and learners on India's most vibrant dance platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="px-10 py-4 bg-maroon-700 hover:bg-maroon-600 text-white font-bold text-lg rounded-xl transition-all shadow-xl hover:shadow-maroon-900/50 inline-flex items-center gap-2 justify-center">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/workshops" className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-all border border-white/20 backdrop-blur-sm">
                            Browse Workshops
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
