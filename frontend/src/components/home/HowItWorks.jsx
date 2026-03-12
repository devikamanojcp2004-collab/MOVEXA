import { UserPlus, Search, CalendarCheck } from 'lucide-react';

const STEPS = [
    {
        id: 1,
        title: "Create an Account",
        description: "Sign up in seconds to access exclusive workshops and manage your bookings.",
        icon: UserPlus,
        color: "bg-maroon-50 text-maroon-600"
    },
    {
        id: 2,
        title: "Find Your Groove",
        description: "Browse curated workshops by style, instructor, or location to find the perfect session.",
        icon: Search,
        color: "bg-gold-50 text-gold-600"
    },
    {
        id: 3,
        title: "Book & Dance",
        description: "Secure your spot with one click and get ready to elevate your dance journey.",
        icon: CalendarCheck,
        color: "bg-gray-100 text-gray-800"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-maroon-700 uppercase tracking-widest mb-3">Simple Process</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        From screen to studio in 3 steps
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We've made it easier than ever to connect with the world's best choreographers. No more endless scrolling on social media.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">

                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-maroon-200 via-gold-200 to-gray-200 z-0"></div>

                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">

                                {/* Icon Container */}
                                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-8 shadow-sm transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`}>
                                    <Icon className="w-10 h-10" />

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-maroon-800 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
