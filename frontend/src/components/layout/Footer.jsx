import { Link } from 'react-router-dom';
import { Play, Instagram, Twitter, Youtube, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import DancerLogo from '../common/DancerLogo';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Description */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group inline-block">
                            <DancerLogo className="w-8 h-8 text-white group-hover:text-movexa-400 transition-colors" />
                            <span className="text-2xl font-bold tracking-tighter text-white ml-2">MOVEXA</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            The premium platform for dancers to discover, book, and host transformative dance workshops globally.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-movexa-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-movexa-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-movexa-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-movexa-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <li><Link to="/workshops" className="hover:text-movexa-400 transition-colors">Find Workshops</Link></li>
                            <li><Link to="/instructors" className="hover:text-movexa-400 transition-colors">Top Instructors</Link></li>
                            <li><Link to="/styles" className="hover:text-movexa-400 transition-colors">Dance Styles</Link></li>
                            <li><Link to="/studios" className="hover:text-movexa-400 transition-colors">Partner Studios</Link></li>
                            <li><Link to="/about" className="hover:text-movexa-400 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* For Creators */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">For Creators</h3>
                        <ul className="space-y-4">
                            <li><Link to="/host" className="hover:text-movexa-400 transition-colors">Host a Workshop</Link></li>
                            <li><Link to="/dashboard" className="hover:text-movexa-400 transition-colors">Instructor Dashboard</Link></li>
                            <li><Link to="/resources" className="hover:text-movexa-400 transition-colors">Creator Resources</Link></li>
                            <li><Link to="/guidelines" className="hover:text-movexa-400 transition-colors">Community Guidelines</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-movexa-500 mt-0.5" />
                                <span className="text-gray-400">hello@movexa.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-movexa-500 mt-0.5" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-movexa-500 mt-0.5" />
                                <span className="text-gray-400">123 Dance Ave, Suite 400<br />New York, NY 10001</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} MOVEXA. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
