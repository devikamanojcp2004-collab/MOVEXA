import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-white">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-movexa-100/50 blur-3xl opacity-70"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-400/30 blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gray-200/50 blur-3xl opacity-80"></div>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-movexa-50 border border-movexa-100 text-movexa-700 text-sm font-medium mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-movexa-600"></span>
                            New workshops opening daily
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                            Move. <span className="text-transparent bg-clip-text bg-gradient-to-r from-movexa-600 to-gold-600">Express.</span> <br />Elevate.
                        </h1>

                        <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                            Book exclusive dance workshops from top choreographers around the world. Whether you're a beginner or a pro, find your rhythm with MOVEXA.
                        </p>

                        {/* Floating Search Bar */}
                        <div className="bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative flex items-center">
                                <Search className="w-5 h-5 text-gray-400 absolute left-4" />
                                <input
                                    type="text"
                                    placeholder="Dance style (e.g. Hip Hop)"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-movexa-300 focus:ring-2 focus:ring-movexa-100 transition-all outline-none"
                                />
                            </div>
                            <div className="flex-1 relative flex items-center hidden sm:flex">
                                <MapPin className="w-5 h-5 text-gray-400 absolute left-4" />
                                <input
                                    type="text"
                                    placeholder="City or zip"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-movexa-300 focus:ring-2 focus:ring-movexa-100 transition-all outline-none"
                                />
                            </div>
                            <button className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md transform hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-2">
                                Search <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-6 text-sm font-medium text-gray-500">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&w=100&q=80" alt="Dancer" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=100&q=80" alt="Dancer" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=100&q=80" alt="Dancer" />
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
                            </div>
                            <p>Active dancers this week</p>
                        </div>
                    </div>

                    {/* Right Content - Visuals */}
                    <div className="relative lg:h-[600px] flex items-center justify-center">
                        {/* Main Image */}
                        <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1546548729-47090eda4a0b?q=80&w=2070&auto=format&fit=crop"
                                alt="Choreographer teaching"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
                                    <span className="text-sm font-medium">Live Workshop</span>
                                </div>
                                <h3 className="text-2xl font-bold font-sans">Advanced Urban</h3>
                                <p className="text-white/80 text-sm">with Sarah James</p>
                            </div>
                        </div>

                        {/* Floating Card 1 */}
                        <div className="absolute -left-6 lg:-left-12 top-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                            <div className="bg-movexa-100 p-3 rounded-xl text-movexa-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Next Session</p>
                                <p className="font-bold text-gray-900">Today, 5:00 PM</p>
                            </div>
                        </div>

                        {/* Floating Card 2 */}
                        <div className="absolute -right-6 lg:-right-4 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float delay-150">
                            <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full object-cover" alt="Reviewer" />
                            <div>
                                <div className="flex text-yellow-400 text-sm">
                                    ★★★★★
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">"Changed my flow!"</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
