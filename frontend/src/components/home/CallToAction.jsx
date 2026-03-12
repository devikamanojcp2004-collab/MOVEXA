import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="py-24 relative overflow-hidden">

            {/* Background with abstract shapes */}
            <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                {/* Add geometric pattern background */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-maroon-600/30 blur-[100px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold-600/20 blur-[100px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
                    <Sparkles className="w-4 h-4 text-maroon-400" />
                    Join the community of 10,000+ dancers
                </div>

                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                    Ready to step into the <br className="hidden md:block" />spotlight?
                </h2>

                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Whether you're looking to learn from the best or share your own choreography, MOVEXA is your stage.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-maroon-700 hover:bg-maroon-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-maroon-900/40 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        Start Dancing
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
                        Become an Instructor
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
